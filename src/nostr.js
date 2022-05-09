import {relayPool} from 'nostr-tools'

export const pool = relayPool()

setTimeout(async () => {
  let relays = await window.nostr.getRelays()
  for (let url in relays) {
    let policy = relays[url]
    pool.addRelay(url, policy)
  }
}, 500)

pool.getEvent = eventId =>
  new Promise((resolve, reject) => {
    let sub = pool.sub({
      filter: {ids: [eventId]},
      cb: ev => {
        resolve(ev.content)
        sub.unsub()
      }
    })
    setTimeout(() => {
      reject(new Error(`couldn't find event id ${eventId}`))
      sub.unsub()
    }, 2500)
  })
