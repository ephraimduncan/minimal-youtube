const FEATURES = [
    { id: "home", label: "Home feed" },
    { id: "guide", label: "Sidebar", hint: "Navigation menu on the left" },
    {
        id: "related",
        label: "Recommended videos",
        hint: "Beside and after a video",
    },
    { id: "comments", label: "Comments", hint: "And live chat" },
    { id: "shorts", label: "Shorts" },
    { id: "actions", label: "Like and share buttons" },
    {
        id: "topbar",
        label: "Top bar buttons",
        hint: "Create, notifications, voice search",
    },
];

// `shown` lists the features to keep, so a feature added later starts hidden.
const DEFAULTS = { enabled: true, shown: [] };
