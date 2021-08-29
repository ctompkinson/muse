
export type KillstreakProgress = {
  lastSeenPlayer: string;
  count: number;
};

class Killstreaks {
  private static instance: Killstreaks;
  private progressByGuild: Map<string, KillstreakProgress> = new Map<string, KillstreakProgress>();

  public static getInstance(): Killstreaks {
    if (!this.instance) {
      Killstreaks.instance = new Killstreaks();
    }
    return Killstreaks.instance
  }

  update(guildId: string | undefined, playerId: string, msgSendFunc: (message: string) => void): void {
    if (guildId === undefined) {
      return
    }

    if (! this.progressByGuild.has(guildId)) {
      this.progressByGuild.set(guildId, {lastSeenPlayer: playerId, count: 1})
    } else {
      this.progressByGuild.forEach((progress, gId) => {
        if (gId == guildId) {
          if (progress.lastSeenPlayer == playerId) {
            progress.count += 1
            this.printKillstreak(progress.count, msgSendFunc)
          } else {
            progress.lastSeenPlayer = playerId
            progress.count = 1
          }
        }
      })
    }
  }

  printKillstreak(count: number, msgSendFunc: (message: string) => void): void {
    switch (count) {
      case 3:
        msgSendFunc("https://media.giphy.com/media/VuehuL4fMHLgs/giphy.gif")
        break
      case 5:
        msgSendFunc("https://gfycat.com/activepolitebinturong")
        break
      case 7:
        msgSendFunc("https://gfycat.com/contentparchedandalusianhorse")
        break
    }
  }
}

export default Killstreaks;
