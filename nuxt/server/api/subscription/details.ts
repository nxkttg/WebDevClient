export default defineEventHandler((event) => {
  const query = getQuery(event)
  const planId = query.plan?.toString().toLowerCase() || 'starter'

  const plansData = {
    starter: {
      planName: 'Starter - Annual',
      monthlyPrice: 83.25,
      oldYearlyPrice: 1188,
      newYearlyPrice: 999,
      savings: 189,
      color: 'border-cyan-400',
      features: ['Primary user only', 'Save unlimited properties', '10,000 exports', '500 free skip traces']
    },
    team: {
      planName: 'Team - Annual',
      monthlyPrice: 207.50,
      oldYearlyPrice: 2988,
      newYearlyPrice: 2490,
      savings: 498,
      color: 'border-green-400',
      features: ['Primary user + 2 free team members', 'Save unlimited properties', '50,000 exports', '1,000 free skip traces']
    },
    business: {
      planName: 'Business - Annual',
      monthlyPrice: 457.50,
      oldYearlyPrice: 6588,
      newYearlyPrice: 5490,
      savings: 1098,
      color: 'border-lime-500',
      features: ['Primary user + 6 free team members', 'Save unlimited properties', '100,000 exports', '2,000 free skip traces']
    }
  }

  return plansData[planId] || plansData.starter
})