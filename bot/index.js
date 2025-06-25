
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const cargosPorPlano = {
  'VIP Nível Clássico': '1382840386052952064',
  'VIP Nível Ouro': '1373334275490844672',
  'VIP Nível Platina': '1373334274144469084',
  'VIP Nível Exclusivo': '1373334272932446360',
};

client.once('ready', () => {
  console.log(`🤖 Bot logado como ${client.user.tag}`);
});

app.post('/webhook-compra', async (req, res) => {
  const { discordID, plano } = req.body;

  const roleId = cargosPorPlano[plano];
  if (!roleId) return res.status(400).send('Plano inválido.');

  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = await guild.members.fetch(discordID);
    await member.roles.add(roleId);
    console.log(`✅ Cargo ${plano} adicionado a ${discordID}`);
    res.send(`Cargo do plano "${plano}" atribuído com sucesso!`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atribuir o cargo.');
  }
});

client.login(process.env.TOKEN_DISCORD);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Webhook rodando na porta ${process.env.PORT || 3000}`);
});
