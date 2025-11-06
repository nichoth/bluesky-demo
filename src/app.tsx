import {
    useCallback,
    type FunctionComponent,
} from 'react'
import { signal, useSignal } from '@preact/signals-react'
import Debug from '@substrate-system/debug'
import { type Api } from './api'
// import { Button } from './components/button'
import './app.css'
import { reports, type Report } from './fixture'

export const EM_DASH = '\u2014'
export const NBSP = '\u00A0'
const debug = Debug(isDev())

// ------------------------------------------------------
// displays a moderation queue of reported users and content from the
// atproto network.
//
// * static array of reports
// interface where a moderator can review these reports with necessary details
// from the network (user profile, post content etc.)
// ------------------------------------------------------

// four tabs

// * Open app → Queue tab shows unreviewed reports and the reported content.
// * Choose Approve or Takedown → the item moves to the appropriate tab.
// * Go to All tab → type a query → results filter in real time across
//   profile/post text.

// Whenever the `count` signal is updated,
// the component will re-render automatically
const count = signal(0)

/**
 * Expose state for dev and staging
 */
if (isDev()) {
    debug(`${import.meta.env?.MODE} mode`)

    // @ts-expect-error dev
    window.state = { count }

    // @ts-expect-error dev
    window.debug = debug
}

// if user then DID
// if post then at URI

type Tab = 'Queue'|'Approved'|'Takedown'|'All'
const tabs:Tab[] = ['Queue', 'Approved', 'Takedown', 'All']

// users
// https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=<did>
// need DID

// posts
// https://api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=<at_uri>
// need at URI

// show all report
// click tabs

export const App:FunctionComponent<{ api:typeof Api }> = function App () {
    // const isSpinning = useSignal<boolean>(false)
    // const response = useSignal<string|null>(null)
    const tab = useSignal<Tab>('Queue')

    const tabStates = useSignal<Record<Exclude<Tab, 'All'>, Report[]>>({
        Queue: [...reports],
        Approved: [],
        Takedown: []
    })

    const approve = useCallback((ev:React.MouseEvent, report:Report) => {
        ev.preventDefault()
        // move into approved tab
        // rm from queue
        debug('approve', report)

        const newQueue = tabStates.value.Queue.filter((r) => {
            return (r.subject !== report.subject)
        })

        tabStates.value = {
            ...tabStates.value,
            Approved: [...tabStates.value.Approved, report],
            Queue: newQueue
        }
    }, [])

    const takedown = useCallback((ev:React.MouseEvent) => {
        ev.preventDefault()
        // move into takedown tab
        // rm from queue
        debug('takedown')
    }, [])

    return (
        <>
            <nav>
                {tabs.map(currentTab => {
                    const className = [
                        'tab',
                        tab.value === currentTab ? 'active' : ''
                    ].filter(Boolean)

                    return <button key={currentTab} className={className.join(' ')}>
                        {currentTab}
                    </button>
                })}
            </nav>

            <ul className="reports">
                {reports.map(report => {
                    return <li key={report.subject} className="report">
                        <div>{report.subject}</div>
                        <div>{report.reportType}</div>
                        {report.comment ?
                            <div>{report.comment}</div> :
                            null
                        }

                        <div className='controls'>
                            <button
                                onClick={(ev) => approve(ev, report)}
                                className="approve"
                            >Approve</button>
                            <button
                                onClick={takedown}
                                className="takedown"
                            >Takedown</button>
                        </div>
                    </li>
                })}
            </ul>
        </>
    )
}

export default App

function isDev ():boolean {
    return (import.meta.env?.DEV || import.meta.env?.MODE !== 'production')
}
