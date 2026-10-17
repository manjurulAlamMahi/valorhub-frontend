export type ChatMessage = {
  id: string;
  // "me" is the contractor; anything else is the customer
  from: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  initials: string;
  project: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
};

export const conversations: Conversation[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    initials: "SM",
    project: "Kitchen Remodel",
    time: "2h ago",
    unread: 2,
    messages: [
      {
        id: "1",
        from: "them",
        text: "Hi Marcus! Really excited about the kitchen project.",
        time: "Mon 9:10am",
      },
      {
        id: "2",
        from: "me",
        text: "Hi Sarah! We're all set. Demo starts the 15th as planned.",
        time: "Mon 9:25am",
      },
      {
        id: "3",
        from: "them",
        text: "Perfect. One quick question — are you okay with us keeping the island placement from the original plan?",
        time: "Mon 10:02am",
      },
      {
        id: "4",
        from: "me",
        text: "Yes, absolutely. The island location works great with the traffic flow we discussed.",
        time: "Mon 10:18am",
      },
      {
        id: "5",
        from: "them",
        text: "Can you come for a site visit on Thursday?",
        time: "Today 8:45am",
      },
    ],
  },
  {
    id: "david",
    name: "David Okonkwo",
    initials: "DO",
    project: "Deck Installation",
    time: "4h ago",
    unread: 1,
    messages: [
      {
        id: "1",
        from: "me",
        text: "Hi David, I've sent over the quote for the composite deck.",
        time: "Today 9:30am",
      },
      {
        id: "2",
        from: "them",
        text: "Thanks for the quote, looks good to me.",
        time: "Today 10:05am",
      },
    ],
  },
  {
    id: "james",
    name: "James Torres",
    initials: "JT",
    project: "Commercial Fit-Out",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "1",
        from: "them",
        text: "How is the site looking this week?",
        time: "Yesterday 3:12pm",
      },
      {
        id: "2",
        from: "me",
        text: "Foundation work complete. Moving to framing next week.",
        time: "Yesterday 4:40pm",
      },
    ],
  },
  {
    id: "lisa",
    name: "Lisa Chen",
    initials: "LC",
    project: "Bathroom Renovation",
    time: "Jul 30",
    unread: 0,
    messages: [
      {
        id: "1",
        from: "me",
        text: "Tile arrives Friday, so we can start Monday morning.",
        time: "Jul 30 2:15pm",
      },
      { id: "2", from: "them", text: "See you Monday!", time: "Jul 30 2:32pm" },
    ],
  },
];
