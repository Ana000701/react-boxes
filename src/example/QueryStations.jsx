import { useStations } from "@/hooks/useStations";

/**
 * QueryStations 元件
 * 顯示從 `useStations` 取得的站點資料，並處理加載與錯誤狀態。
 *
 * @returns {JSX.Element} 顯示站點資料的列表，或顯示加載/錯誤訊息
 */
function QueryStations() {
  const { stations, isLoadingStations, stationsError } = useStations();

  // 若資料正在加載中，顯示加載訊息
  if (isLoadingStations) return <p>isLoadingStations....</p>;

  // 若發生錯誤，顯示錯誤訊息
  if (stationsError) return <p>發生錯誤: {stationsError.message}</p>;

  // 顯示站點資料列表
  return (
    <ul className="list-disc border p-10">
      {stations.map((el) => (
        <li key={el.id}>{el.station_name}</li>
      ))}
    </ul>
  );
}

export default QueryStations;
