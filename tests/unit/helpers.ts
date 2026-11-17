// テスト用の補助関数です。

type TimerGlobal = { setTimeout: (callback: () => void, delay?: number) => unknown }
const timerGlobal = globalThis as unknown as TimerGlobal
const realSetTimeout = timerGlobal.setTimeout

// 保留中の Promise を解決させます。
export const flushPromises = function (): Promise<void> {
  return new Promise(resolve => { realSetTimeout(resolve, 0) })
}

// setTimeout を差し替え、登録されたコールバックを任意のタイミングで実行できるようにします。
export class FakeTimers {
  private queue: { callback: () => void, delay?: number }[] = []

  install (): void {
    timerGlobal.setTimeout = (callback, delay) => {
      this.queue.push({ callback, delay })
      return 0
    }
  }

  uninstall (): void {
    timerGlobal.setTimeout = realSetTimeout
    this.queue = []
  }

  // 登録順に最も古いコールバックを実行し、その delay を返します。
  runNext (): number | undefined {
    const timer = this.queue.shift()
    if (!timer) {
      throw new Error('No pending timer.')
    }
    timer.callback()
    return timer.delay
  }

  get pending (): number {
    return this.queue.length
  }
}
