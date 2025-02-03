import supabase from "./supabase";

/**
 * 從 Supabase 取得所有站點資料
 *
 * 該函式向 Supabase 的 `stations` 表格請求資料，並處理錯誤。
 *
 * @async
 * @function apiGetStations
 * @returns {Promise<Array>} 站點資料陣列，若請求成功返回資料，若失敗則會拋出錯誤
 * @throws {Error} 如果請求過程中發生錯誤，則會拋出錯誤
 */
export async function apiGetStations() {
  try {
    let { data: stations, error } = await supabase.from("stations").select("*");

    if (error) throw error;

    console.log(stations);

    return stations;
  } catch (error) {
    console.error(error);
    // 重新拋出錯誤，讓 useQuery 取得錯誤狀態
    throw error;
  }
}
