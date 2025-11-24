import { type ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const roleCommand = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Role management commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user")
        .addUserOption((option) => option.setName("user").setDescription("User to add role to").setRequired(true))
        .addRoleOption((option) => option.setName("role").setDescription("Role to add").setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role from a user")
        .addUserOption((option) => option.setName("user").setDescription("User to remove role from").setRequired(true))
        .addRoleOption((option) => option.setName("role").setDescription("Role to remove").setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Get information about a role")
        .addRoleOption((option) => option.setName("role").setDescription("Role to get info about").setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("members")
        .setDescription("List members with a role")
        .addRoleOption((option) =>
          option.setName("role").setDescription("Role to check members for").setRequired(true),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === "add") {
      await handleRoleAdd(interaction)
    } else if (subcommand === "remove") {
      await handleRoleRemove(interaction)
    } else if (subcommand === "info") {
      await handleRoleInfo(interaction)
    } else if (subcommand === "members") {
      await handleRoleMembers(interaction)
    }
  },
}

async function handleRoleAdd(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const role = interaction.options.getRole("role", true)
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const member = await guild.members.fetch(targetUser.id).catch(() => null)

  if (!member) {
    await interaction.editReply("User not found in this server.")
    return
  }

  if (member.roles.cache.has(role.id)) {
    await interaction.editReply(`${targetUser.tag} already has the ${role.name} role.`)
    return
  }

  try {
    await member.roles.add(role.id)

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("Role Added")
      .setDescription(`**User:** ${targetUser.tag}\n` + `**Role:** ${role.name}`)
      .setFooter({ text: `Added by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log the action
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "ROLE_ADD",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      target_user_id: targetUser.id,
      target_user_tag: targetUser.tag,
      details: { role_id: role.id, role_name: role.name },
    })
  } catch (error) {
    await interaction.editReply("Failed to add role.")
  }
}

async function handleRoleRemove(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const role = interaction.options.getRole("role", true)
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const member = await guild.members.fetch(targetUser.id).catch(() => null)

  if (!member) {
    await interaction.editReply("User not found in this server.")
    return
  }

  if (!member.roles.cache.has(role.id)) {
    await interaction.editReply(`${targetUser.tag} does not have the ${role.name} role.`)
    return
  }

  try {
    await member.roles.remove(role.id)

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("Role Removed")
      .setDescription(`**User:** ${targetUser.tag}\n` + `**Role:** ${role.name}`)
      .setFooter({ text: `Removed by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log the action
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "ROLE_REMOVE",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      target_user_id: targetUser.id,
      target_user_tag: targetUser.tag,
      details: { role_id: role.id, role_name: role.name },
    })
  } catch (error) {
    await interaction.editReply("Failed to remove role.")
  }
}

async function handleRoleInfo(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const role = interaction.options.getRole("role", true)
  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const guildRole = await guild.roles.fetch(role.id).catch(() => null)

  if (!guildRole) {
    await interaction.editReply("Role not found.")
    return
  }

  const embed = new EmbedBuilder()
    .setColor(guildRole.hexColor)
    .setTitle(`Role Information: ${guildRole.name}`)
    .addFields(
      { name: "ID", value: guildRole.id, inline: true },
      { name: "Color", value: guildRole.hexColor, inline: true },
      { name: "Position", value: guildRole.position.toString(), inline: true },
      { name: "Members", value: guildRole.members.size.toString(), inline: true },
      { name: "Mentionable", value: guildRole.mentionable ? "Yes" : "No", inline: true },
      { name: "Hoisted", value: guildRole.hoist ? "Yes" : "No", inline: true },
      { name: "Created", value: `<t:${Math.floor(guildRole.createdTimestamp / 1000)}:R>` },
    )
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })
}

async function handleRoleMembers(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const role = interaction.options.getRole("role", true)
  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const guildRole = await guild.roles.fetch(role.id).catch(() => null)

  if (!guildRole) {
    await interaction.editReply("Role not found.")
    return
  }

  const members = guildRole.members.map((m) => m.user.tag).slice(0, 20)

  const embed = new EmbedBuilder()
    .setColor(guildRole.hexColor)
    .setTitle(`Members with ${guildRole.name}`)
    .setDescription(
      `**Total Members:** ${guildRole.members.size}\n\n` +
        (members.length > 0
          ? members.join("\n") + (guildRole.members.size > 20 ? "\n\n...and more" : "")
          : "No members with this role"),
    )
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })
}
