import type { Interaction } from "discord.js"
import { ticketCommand } from "../commands/ticket"
import { setupCommand } from "../commands/setup"
import { warnCommand } from "../commands/warn"
import { moderationCommand } from "../commands/moderation"
import { channelCommand } from "../commands/channel"
import { roleCommand } from "../commands/role"

const commands = new Map()
commands.set("ticket", ticketCommand)
commands.set("setup", setupCommand)
commands.set("warn", warnCommand)
commands.set("mod", moderationCommand)
commands.set("channel", channelCommand)
commands.set("role", roleCommand)

export async function handleInteractionCreate(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error("[v0] Error executing command:", error)

      const reply = {
        content: "There was an error executing this command!",
        ephemeral: true,
      }

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply)
      } else {
        await interaction.reply(reply)
      }
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "close_ticket") {
      // Handle close ticket button
      const { ticketCommand } = await import("../commands/ticket")
      // Create a mock interaction for the close command
      await interaction.deferReply()

      const channel = interaction.channel
      const guild = interaction.guild
      const user = interaction.user

      if (!guild || !channel) return

      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()

      const { data: ticket } = await supabase
        .from("tickets")
        .select("*")
        .eq("channel_id", channel.id)
        .eq("status", "open")
        .single()

      if (!ticket) {
        await interaction.editReply("This is not an open ticket channel.")
        return
      }

      await supabase
        .from("tickets")
        .update({
          status: "closed",
          closed_at: new Date().toISOString(),
          closed_by: user.id,
        })
        .eq("id", ticket.id)

      await interaction.editReply(`Ticket closed by ${user.tag}. This channel will be deleted in 5 seconds.`)

      setTimeout(async () => {
        await channel.delete()
      }, 5000)

      await supabase.from("mod_logs").insert({
        guild_id: guild.id,
        action_type: "TICKET_CLOSE",
        moderator_id: user.id,
        moderator_tag: user.tag,
        target_user_id: ticket.user_id,
        details: { ticket_number: ticket.ticket_number },
      })
    }
  }
}
