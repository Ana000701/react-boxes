import {
  apiGetAdminTransactionRecords,
  apiGetMemberTransactionRecords,
} from "@/services/apiBoxTransactions";
import { useQuery } from "@tanstack/react-query";

/**
 * 自訂 Hook：使用 React Query 來取得 管理者-紙箱交易紀錄的交易資料
 *
 * 使用 `useQuery` 來向 API 請求 管理者-紙箱交易紀錄的交易資料，並處理資料加載與錯誤狀態。
 *
 * @returns {Object} 返回包含三個屬性的物件：
 *   - `boxes` {Array|null} - 紙箱資料陣列，若尚未請求或發生錯誤則為 `null`
 *   - `isLoadingBoxes` {boolean} - 是否正在加載資料
 *   - `BoxesError` {Error|null} - 若請求發生錯誤，將包含錯誤物件，否則為 `null`
 */
export function useAdminTransactionRecords(stationId) {
  const {
    data: records,
    isLoading: isLoadingRecords,
    error: recordsError,
  } = useQuery({
    queryKey: ["boxes-transactions", stationId],
    queryFn: () => apiGetAdminTransactionRecords(stationId),
  });

  return { records, isLoadingRecords, recordsError };
}

/**
 * 自訂 Hook：使用 React Query 來取得 一般會員-紙箱交易紀錄的交易資料
 *
 * 使用 `useQuery` 來向 API 請求 一般會員-紙箱交易紀錄的交易資料，並處理資料加載與錯誤狀態。
 *
 * @returns {Object} 返回包含三個屬性的物件：
 *   - `boxes` {Array|null} - 紙箱資料陣列，若尚未請求或發生錯誤則為 `null`
 *   - `isLoadingBoxes` {boolean} - 是否正在加載資料
 *   - `BoxesError` {Error|null} - 若請求發生錯誤，將包含錯誤物件，否則為 `null`
 */
export function useMemberTransactionRecords(userId) {
  const {
    data: records,
    isLoading: isLoadingRecords,
    error: recordsError,
  } = useQuery({
    queryKey: ["boxes-transactions", userId],
    queryFn: () => apiGetMemberTransactionRecords(userId),
  });

  return { records, isLoadingRecords, recordsError };
}
