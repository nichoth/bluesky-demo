export type Report = {
  subject: string;      // Either a DID (user) or an AT-URI (limited to post records only for the purpose of this exercise)
  reportType: string;   // Reason the item was reported
  comment?: string;      // Reporter’s comment
};

export const reports:Report[] = [
    {
        subject: 'did:plc:upo6iq6ekh66d4mbhmiy6se4',
        reportType: 'spam',
        comment: 'This user is spamming me in dms.'
    },
    {
        subject: 'at://did:plc:upo6iq6ekh66d4mbhmiy6se4/app.bsky.feed.post/3lxd54zft7k2s',
        reportType: 'rude',
        comment: 'This is not a nice thing to say.'
    },
    {
        subject: 'did:plc:oisofpd7lj26yvgiivf3lxsi',
        reportType: 'impersonation',
        comment: 'This user is not who they say they are'
    },
    {
        subject: 'at://did:plc:oisofpd7lj26yvgiivf3lxsi/app.bsky.feed.post/3liws73p2hc2c',
        reportType: 'graphic',
        comment: 'I dont want to see cats on my feed'
    }
]
