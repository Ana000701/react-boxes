import QueryStations from "@/example/QueryStations";

function HomePage() {
  return (
    <>
      <div>首頁</div>
      {/*React Query 取得站點資料範例 */}
      <QueryStations />
    </>
  );
}

export default HomePage;
