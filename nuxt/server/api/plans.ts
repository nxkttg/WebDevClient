export default defineEventHandler(() => {
  return [
    {
      id: 1,
      name: 'Starter',
      price: 83.25,
      oldPrice: 1188,
      savings: 189,
      color: 'from-cyan-400 to-blue-500',
      features: [
        {
          text: 'Primary user only',
          subtext: '(extra team members for $35/month)',
        },
        { text: 'Save unlimited properties' },
        {
          text: '10,000 exports',
          subtext: '(additional exports at $0.02 each)',
        },
        { text: '500 FREE skip traces' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' },
      ],
    },
    {
      id: 2,
      name: 'Team',
      price: 207.5,
      oldPrice: 2988,
      savings: 498,
      color: 'from-blue-500 to-indigo-600',
      features: [
        {
          text: 'Primary user + 2 FREE team members',
          subtext: '(extra team members for $25/month)',
        },
        { text: 'Save unlimited properties' },
        {
          text: '50,000 exports',
          subtext: '(additional exports at $0.01 each)',
        },
        { text: '1,000 FREE skip traces' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' },
      ],
    },
    {
      id: 3,
      name: 'Business',
      price: 457.5,
      oldPrice: 6588,
      savings: 1098,
      color: 'from-emerald-400 to-green-500',
      features: [
        {
          text: 'Primary user + 6 FREE team members',
          subtext: '(extra team members for $20/month)',
        },
        { text: 'Save unlimited properties' },
        {
          text: '100,000 exports',
          subtext: '(additional exports at $0.01 each)',
        },
        { text: '2,000 FREE skip traces' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' },
      ],
    },
  ];
});
