import {inject, injectable} from 'inversify';
import {Message, Guild} from 'discord.js';
import {TYPES} from '../types';
import PlayerManager from '../managers/player';
import {QueuedSong} from '../services/player';
import {getMostPopularVoiceChannel} from '../utils/channels';

@injectable()
export default class {
  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  async execute(msg: Message): Promise<boolean> {
    if (msg.content.startsWith('say') && msg.content.endsWith('muse')) {
      const res = msg.content.slice(3, msg.content.indexOf('muse')).trim();

      await msg.channel.send(res);
      return true;
    }

    if (msg.content.toLowerCase().includes('packers')) {
      await Promise.all([
        msg.channel.send('GO PACKERS GO!!!'),
        this.playClip(msg.guild!, {title: 'GO PACKERS!', artist: 'Unknown', url: 'https://www.youtube.com/watch?v=qkdtID7mY3E', length: 204, playlist: null, isLive: false}, 8, 10)
      ]);

      return true;
    }

    if (msg.content.toLowerCase().includes('bears')) {
      await Promise.all([
        msg.channel.send('F*** THE BEARS'),
        this.playClip(msg.guild!, {title: 'GO PACKERS!', artist: 'Charlie Berens', url: 'https://www.youtube.com/watch?v=UaqlE9Pyy_Q', length: 385, playlist: null, isLive: false}, 358, 5.5)
      ]);

      return true;
    }

    if (msg.content.toLowerCase().includes('bitconnect')) {
      await Promise.all([
        msg.channel.send('🌊 🌊 🌊 🌊'),
        this.playClip(msg.guild!, {title: 'BITCONNEEECCT', artist: 'Carlos Matos', url: 'https://www.youtube.com/watch?v=lCcwn6bGUtU', length: 227, playlist: null, isLive: false}, 50, 13)
      ]);

      return true;
    }

    if (msg.content.toLowerCase().includes("nice one")) {
      await Promise.all([
        msg.channel.send("OH NICE"),
        this.playClip(msg.guild!, {
          title: 'OH NICE',
          artist: 'Yokie',
          url: 'https://www.youtube.com/watch?v=_Of3mcByF2Y',
          length: 31,
          playlist: null,
          isLive: false
        }, 25, 6)
      ])
      return true;
    }

    if (msg.content.toLowerCase().includes("scum")) {
      await Promise.all([
        msg.channel.send("STOP RIGHT THERE CRIMINAL SCUM"),
        this.playClip(msg.guild!, {
          title: 'STOP RIGHT THERE CRIMINAL SCUM',
          artist: 'Oblivion',
          url: 'https://www.youtube.com/watch?v=jrlzlaHEaB0',
          length: 94,
          playlist: null,
          isLive: false
        }, 9, 5)
      ])
      return true;
    }

    if (msg.content.toLowerCase().includes("milk")) {
      await Promise.all([
        msg.channel.send("🥛🥛🥛 I CAN MAKE MILK 🥛🥛🥛"),
        this.playClip(msg.guild!, {
          title: 'I CAN MAKE MILK',
          artist: 'Taylor',
          url: 'https://www.youtube.com/watch?v=Lyl48CJA5vc',
          length: 19,
          playlist: null,
          isLive: false
        }, 0, 4)
      ])
      return true;
    }

    return false;
  }

  private async playClip(guild: Guild, song: QueuedSong, position: number, duration: number): Promise<void> {
    const player = this.playerManager.get(guild.id);

    const [channel, n] = getMostPopularVoiceChannel(guild);

    if (!player.voiceConnection && n === 0) {
      return;
    }

    if (!player.voiceConnection) {
      await player.connect(channel);
    }

    const isPlaying = player.getCurrent() !== null;
    let oldPosition = 0;

    player.add(song, {immediate: true});

    if (isPlaying) {
      oldPosition = player.getPosition();

      player.manualForward(1);
    }

    await player.seek(position);

    return new Promise((resolve, reject) => {
      try {
        setTimeout(async () => {
          if (player.getCurrent()?.title === song.title) {
            player.removeCurrent();

            if (isPlaying) {
              await player.back();
              await player.seek(oldPosition);
            } else {
              player.disconnect();
            }
          }

          resolve();
        }, duration * 1000);
      } catch (error: unknown) {
        reject(error);
      }
    });
  }
}
