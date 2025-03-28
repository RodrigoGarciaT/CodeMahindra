interface LeaderboardEntry {
    rank: number;
    userName: string;
    profilePic: string;
    testCasesPassed: number;
    time: string;
  }
  
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userName: 'AlgorithmMaster',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      testCasesPassed: 15,
      time: '0.32s'
    },
    {
      rank: 2,
      userName: 'CodeNinja',
      profilePic: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
      testCasesPassed: 15,
      time: '0.45s'
    },
    {
      rank: 3,
      userName: 'ByteWarrior',
      profilePic: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&h=100&fit=crop',
      testCasesPassed: 14,
      time: '0.38s'
    },
    {
      rank: 4,
      userName: 'DataStructureGuru',
      profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      testCasesPassed: 13,
      time: '0.41s'
    },
    {
      rank: 5,
      userName: 'OptimizationPro',
      profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      testCasesPassed: 12,
      time: '0.44s'
    }
  ];
  
  const Leaderboard = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Cases</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLeaderboard.map((entry) => (
                <tr key={entry.rank} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{entry.rank}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img className="h-8 w-8 rounded-full" src={entry.profilePic} alt="" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{entry.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.testCasesPassed}/15</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Leaderboard;