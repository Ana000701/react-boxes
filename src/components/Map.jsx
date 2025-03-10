import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { NavLink } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Button } from "./ui/button";
import { useStation } from "@/hooks/useStation";
import { useStations } from "@/hooks/useStations";

import MapNav from "./MapNav";
import Spinner from "@/components/Spinner";
import ErrorMessage from "./ErrorMessage";
import mapMark from "../assets/mapMark.png";
import SellingBoxesCard from "./card/SellingBoxesCard";
import { getPendingBoxes } from "@/utils/helpers";

// 取得使用者定位
const UserLocation = ({ setUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          map.setView([latitude, longitude], 15); // 設定地圖中心到用戶位置
        },
        (error) => {
          console.error("無法獲取位置：", error);
        },
      );
    } else {
      console.error("瀏覽器不支援地理位置功能！");
    }
  }, [map]);

  return null; // 不需要渲染任何元素
};

// 建議站點卡
const SuggestionStationCard = ({
  station,
  countRecyclableBoxes,
  countPendingBoxes,
  formatPhoneNumber,
  setClickedId,
  mapRef,
  setIsStationInfo,
  isLg,
  setIsSideBar,
  markerRefs,
  setPopupStation,
}) => {
  const { latitude, longitude } = station; //取得經緯度
  const [isBoxSize, setIsBoxSize] = useState(false); //開啟查看紙箱尺寸

  const countsObj = getPendingBoxes(station.boxes);

  //前往選擇站點定位
  const handleCheckStation = () => {
    setPopupStation(station); // 設定選中的站點

    if (mapRef.current && isLg) {
      const map = mapRef.current;
      map.setView([latitude, longitude], 15);
    } else if (mapRef.current) {
      const map = mapRef.current;
      map.setView([latitude, longitude], 15);
      setIsSideBar(false);
    }

    // 開啟對應站點的 Popup
    if (markerRefs.current[station.id]) {
      markerRefs.current[station.id].openPopup();
    }
  };

  return (
    <div className="rounded-lg border p-[24px]">
      <button onClick={() => handleCheckStation()}>
        <h5 className="mb-[12px]">{station.station_name}</h5>
      </button>
      <h5 className="mb-[12px] flex gap-[8px] text-base">
        {countRecyclableBoxes(station) ? (
          <span className="fs-7 rounded-full bg-main-200 px-[12px] py-[4px]">
            可回收
          </span>
        ) : (
          <></>
        )}
        {countPendingBoxes(station) ? (
          <span className="fs-7 rounded-full bg-second-200 px-[12px] py-[4px]">
            可認領
          </span>
        ) : (
          <></>
        )}
      </h5>

      <ul className="fs-6 mb-[12px] flex flex-col gap-[12px] text-[#6F6F6F]">
        <li className="flex items-start justify-start gap-[8px]">
          <span className="material-symbols-outlined">location_on</span>
          {`地址:${station.address}`}
        </li>
        <li className="flex items-start justify-start gap-[8px]">
          <span className="material-symbols-outlined">call</span>
          {`電話:${station.phone ? formatPhoneNumber(station.phone) : "尚未填寫"}`}
        </li>
      </ul>

      <div className="mb-[24px] rounded-lg border border-solid border-[#B7B7B7] p-[16px]">
        <h6 className="mb-[12px]">回收認領資訊</h6>

        <div className="mb-[12px] flex flex-col justify-center gap-[8px] lg:flex-row">
          {/* 可回收 */}
          <div className="w-full">
            <p className="mb-[8px] w-full rounded-lg bg-main-100 py-[4px] text-center text-main-600">
              可回收紙箱
            </p>
            <div className="flex w-full gap-[4px]">
              <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[6px] text-main-600">
                <h4>{station.available_slots.S}</h4>
                <p>S</p>
              </div>
              <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[6px] text-main-600">
                <h4>{station.available_slots.M}</h4>
                <p>M</p>
              </div>
              <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[6px] text-main-600">
                <h4>{station.available_slots.L}</h4>
                <p>L</p>
              </div>
              <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[6px] text-main-600">
                <h4>{station.available_slots.XL}</h4>
                <p>XL</p>
              </div>
            </div>
          </div>
          {/* 可認領 */}
          <div className="w-full">
            <p className="text-second-600 mb-[8px] w-full rounded-lg bg-second-100 py-[4px] text-center">
              可認領紙箱
            </p>
            <div className="flex w-full gap-[4px]">
              <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[6px]">
                <h4>{countsObj["小"] || 0}</h4>
                <p>S</p>
              </div>
              <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[6px]">
                <h4>{countsObj["中"] || 0}</h4>
                <p>M</p>
              </div>
              <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[6px]">
                <h4>{countsObj["大"] || 0}</h4>
                <p>L</p>
              </div>
              <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[6px]">
                <h4>{countsObj["特大"] || 0}</h4>
                <p>XL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#B7B7B7] pt-[12px]">
          <div className="flex justify-between">
            <p>查看紙箱尺寸</p>
            <button onClick={() => setIsBoxSize(!isBoxSize)}>
              {isBoxSize ? (
                <span className="material-symbols-outlined">
                  keyboard_arrow_up
                </span>
              ) : (
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              )}
            </button>
          </div>
          {isBoxSize ? (
            <ul className="list-inside list-disc text-[#6F6F6F]">
              <li>小紙箱：總長 50 公分以下</li>
              <li>中紙箱：總長 50 ~ 120 公分</li>
              <li>大紙箱：總長 120 公分以上</li>
            </ul>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[12px] text-center md:flex-row">
        <button
          className="btn"
          onClick={() => {
            setClickedId(station.id);
            setIsStationInfo(true);
          }}
        >
          站點資訊
        </button>
        <NavLink className="btn" to={`/map/${station.id}`}>
          查看本站紙箱列表
        </NavLink>
      </div>
    </div>
  );
};

//側邊欄站點詳細資訊
const StationDetailedInfo = ({
  station,
  countRecyclableBoxes,
  countPendingBoxes,
  formatPhoneNumber,
  handleBackSuggestaion,
}) => {
  const [isAllOpenTime, setIsAllOpenTime] = useState(false); //開啟詳細營業時間
  const [isBoxSize, setIsBoxSize] = useState(false); //開啟查看紙箱尺寸

  const countsObj = getPendingBoxes(station.boxes);

  // 取得一週的營業時間
  const formatOpenTime = (station_daily_hours) => {
    return station_daily_hours.map((item, index) => {
      const openTime = item.open_time.replace(/^(\d{2}:\d{2}):\d{2}.*/, "$1");
      const closeTime = item.close_time.replace(/^(\d{2}:\d{2}):\d{2}.*/, "$1");

      if (index === 0) {
        return (
          <li key={index}>
            {item ? `星期日 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      } else if (index === 1) {
        return (
          <li key={index}>
            {item ? `星期一 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      } else if (index === 2) {
        return (
          <li key={index}>
            {item ? `星期二 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      } else if (index === 3) {
        return (
          <li key={index}>
            {item ? `星期三 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      } else if (index === 4) {
        return (
          <li key={index}>
            {item ? `星期四 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      } else if (index === 5) {
        return (
          <li key={index}>
            {item ? `星期五 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      } else {
        return (
          <li key={index}>
            {item ? `星期六 ${openTime}-${closeTime}` : "休息"}
          </li>
        );
      }
    });
  };
  // 取得本日營業時間
  const getTodayOpenTime = (station_daily_hours) => {
    const today = new Date().getDay();
    let todayOpenTime = "";
    station_daily_hours.forEach((item, index) => {
      const openTime = item.open_time.replace(/^(\d{2}:\d{2}):\d{2}.*/, "$1");
      const closeTime = item.close_time.replace(/^(\d{2}:\d{2}):\d{2}.*/, "$1");

      if (today === index) {
        todayOpenTime = `${openTime}-${closeTime}`;
      }
    });

    return todayOpenTime;
  };

  return (
    <div>
      <img
        src={station.image_url}
        alt={station.station_name}
        className="w-full object-cover"
      />
      <div className="p-[24px]">
        <h5 className="mb-[12px]">{station.station_name}</h5>
        <h5 className="mb-[12px] flex gap-[8px] text-base">
          {countRecyclableBoxes(station) ? (
            <span className="fs-7 rounded-full bg-main-200 px-[12px] py-[4px]">
              可回收
            </span>
          ) : (
            <></>
          )}
          {countPendingBoxes(station) ? (
            <span className="fs-7 rounded-full bg-second-200 px-[12px] py-[4px]">
              可認領
            </span>
          ) : (
            <></>
          )}
        </h5>

        <ul className="fs-6 mb-[12px] flex flex-col gap-[12px] text-[#6F6F6F]">
          <li className="flex items-start justify-start gap-[8px]">
            <span className="material-symbols-outlined">location_on</span>
            {`地址:${station.address}`}
          </li>
          <li className="flex items-start justify-start gap-[8px]">
            <span className="material-symbols-outlined">call</span>
            {`電話:${station.phone ? formatPhoneNumber(station.phone) : "尚未填寫"}`}
          </li>
          <li className="flex items-start justify-start gap-[8px]">
            <span className="material-symbols-outlined">schedule</span>
            <p>{`營業時間:${getTodayOpenTime(station.station_daily_hours)}`}</p>
            <button onClick={() => setIsAllOpenTime(!isAllOpenTime)}>
              {isAllOpenTime ? (
                <span className="material-symbols-outlined">
                  keyboard_arrow_up
                </span>
              ) : (
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              )}
            </button>
          </li>
          {isAllOpenTime && (
            <ul className="flex w-full flex-col items-center gap-[8px]">
              {formatOpenTime(station.station_daily_hours)}
            </ul>
          )}
        </ul>

        <div className="mb-[24px] rounded-lg border border-solid border-[#B7B7B7] p-[16px]">
          <h6 className="mb-[12px]">回收認領資訊</h6>

          <div className="mb-[12px] flex flex-col justify-center gap-[25px] lg:flex-row">
            {/* 可回收 */}
            <div>
              <p className="mb-[8px] w-full rounded-lg bg-main-100 py-[4px] text-center text-main-600">
                可回收紙箱
              </p>
              <div className="flex gap-[8px]">
                <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[8px] text-main-600">
                  <h4>{station.available_slots.S}</h4>
                  <p>S</p>
                </div>
                <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[8px] text-main-600">
                  <h4>{station.available_slots.M}</h4>
                  <p>M</p>
                </div>
                <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[8px] text-main-600">
                  <h4>{station.available_slots.L}</h4>
                  <p>L</p>
                </div>
                <div className="flex w-full flex-col items-center rounded-lg bg-main-100 p-[8px] text-main-600">
                  <h4>{station.available_slots.XL}</h4>
                  <p>XL</p>
                </div>
              </div>
            </div>
            {/* 可認領 */}
            <div>
              <p className="text-second-600 mb-[8px] w-full rounded-lg bg-second-100 py-[4px] text-center">
                可認領紙箱
              </p>
              <div className="flex gap-[8px]">
                <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[8px]">
                  <h4>{countsObj["小"] || 0}</h4>
                  <p>S</p>
                </div>
                <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[8px]">
                  <h4>{countsObj["中"] || 0}</h4>
                  <p>M</p>
                </div>
                <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[8px]">
                  <h4>{countsObj["大"] || 0}</h4>
                  <p>L</p>
                </div>
                <div className="text-second-600 flex w-full flex-col items-center rounded-lg bg-second-100 p-[8px]">
                  <h4>{countsObj["特大"] || 0}</h4>
                  <p>XL</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#B7B7B7] pt-[12px]">
            <div className="flex justify-between">
              <p>查看紙箱尺寸</p>
              <button onClick={() => setIsBoxSize(!isBoxSize)}>
                {isBoxSize ? (
                  <span className="material-symbols-outlined">
                    keyboard_arrow_up
                  </span>
                ) : (
                  <span className="material-symbols-outlined">
                    keyboard_arrow_down
                  </span>
                )}
              </button>
            </div>
            {isBoxSize ? (
              <ul className="list-inside list-disc text-[#6F6F6F]">
                <li>小紙箱：總長 50 公分以下</li>
                <li>中紙箱：總長 50 ~ 120 公分</li>
                <li>大紙箱：總長 120 公分以上</li>
              </ul>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[8px] text-center md:flex-row">
          <NavLink className="btn" to={`/map/${station.id}`}>
            查看本站紙箱列表
          </NavLink>
          <button className="btn" onClick={() => handleBackSuggestaion()}>
            返回搜尋結果
          </button>
        </div>
      </div>
    </div>
  );
};

//Popup
const PopupCardLg = ({
  station,
  countRecyclableBoxes,
  countPendingBoxes,
  setIsStationInfo,
  setIsSideBar,
  setClickedId,
}) => {
  return (
    <div>
      <h6 className="mb-[12px] text-start font-semibold">
        {station.station_name}
      </h6>
      <div className="flex justify-center gap-[8px]">
        <span className="fs-7 rounded-full bg-main-200 px-[12px] py-[4px]">{`可回收${countRecyclableBoxes(station)}個`}</span>
        <span className="fs-7 rounded-full bg-second-200 px-[12px] py-[4px]">{`可認領${countPendingBoxes(station)}個`}</span>
      </div>
      <p className="mb-[12px]">{station.address}</p>
      <button
        className="btn w-full"
        onClick={() => {
          setClickedId(station.id);
          setIsStationInfo(true);
          setIsSideBar(true);
        }}
      >
        站點資訊
      </button>
    </div>
  );
};

const PopupCard = ({ station, countRecyclableBoxes, countPendingBoxes }) => {
  return (
    <div>
      <h6 className="mb-[12px] text-start font-semibold">
        {station.station_name}
      </h6>
      <div className="flex justify-center gap-[8px]">
        {countRecyclableBoxes(station) && (
          <span className="fs-7 rounded-full bg-main-200 px-[12px] py-[4px]">
            可回收
          </span>
        )}
        {countPendingBoxes(station) && (
          <span className="fs-7 rounded-full bg-second-200 px-[12px] py-[4px]">
            可認領
          </span>
        )}
        {/* <span className="fs-7 rounded-full bg-main-200 px-[12px] py-[4px]">{`可回收${countRecyclableBoxes(station)}個`}</span>
      <span className="fs-7 rounded-full bg-second-200 px-[12px] py-[4px]">{`可認領${countPendingBoxes(station)}個`}</span> */}
      </div>
    </div>
  );
};

function Map() {
  const mapRef = useRef(null); //取得地圖實例

  const [clickedId, setClickedId] = useState(null); //送入站點id，設定選擇站點
  const { stations, isLoadingStations, stationsError } = useStations(); //全部站點
  const { station, isLoadingStation, stationError } = useStation(clickedId); //所選擇的站點詳細資訊

  const [isSideBar, setIsSideBar] = useState(false); //開啟SideBar
  const [isStationInfo, setIsStationInfo] = useState(false); //開啟側邊欄站點資訊
  const [userLocation, setUserLocation] = useState([]); //儲存使用者定位
  const [suggestionStations, setSuggestionStations] = useState([]); //儲存5筆鄰近站點
  const [popupStation, setPopupStation] = useState({}); //儲存Popup站點資訊
  const [searchKeyWords, setSearchKeyWords] = useState(""); //儲存使用者輸入的搜尋關鍵字
  const [availableTags, setAvailableTags] = useState([]); //儲存搜尋建議tags
  const [showSuggestedTags, setShowSuggestedTags] = useState(false); //顯示建議選項
  const [isLg, setIsLg] = useState(false); //畫面大小
  const markerRefs = useRef({}); //儲存所有的marker

  // 取得5筆鄰近站點
  useEffect(() => {
    if (userLocation.length > 0) {
      countDistance();
    }
  }, [userLocation]);

  //取得搜尋建議tags
  useEffect(() => {
    if (stations) {
      getAvailableTags();
    }
  }, [stations]);

  // 畫面大小
  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth >= 992) {
        setIsLg(true);
      } else {
        setIsLg(false);
      }

      // console.log('Window width:', window.innerWidth >= 992);
    };

    checkSize(); // 初始化檢查

    window.addEventListener("resize", checkSize); // 當螢幕大小改變時更新狀態

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (isLoadingStations) return <Spinner />;
  if (stationsError) return <ErrorMessage error={stationsError} />;

  // 資料處理
  // 計算紙箱數量
  const countRecyclableBoxes = (station) => {
    return (
      station.available_slots.XL +
      station.available_slots.L +
      station.available_slots.M +
      station.available_slots.S
    );
  };

  const countPendingBoxes = (station) => station.boxes?.length;

  // 電話國際碼轉換市碼
  const formatPhoneNumber = (phone) => {
    return phone?.replace(/^\+886-/, "0").replace(/#$/, "");
  };

  // 設定icon
  // const customIcon = new L.Icon({
  //   iconUrl: mapMark,
  //   iconSize: [40, 40],
  // });

  const createCustomIcon = (name) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="text-align: center;width:max-content">
                <img src=${mapMark} style='margin:0 auto' />
                <h6 style="color: #9F815B; font-size: 14px;">${name}</h6>
             </div>`,
      iconSize: [40, 41], // 調整圖標大小
      iconAnchor: [20, 41], // 調整圖標的錨點
      popupAnchor: [0, -41], // 調整彈出視窗位置
    });
  };

  // 回到使用者定位
  const handleLocateUser = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView(userLocation, 15);
    }
  };

  // 計算距離
  const countDistance = () => {
    const allDistance = stations.map((item) => ({
      ...item,
      distance: L.latLng(userLocation[0], userLocation[1]).distanceTo(
        L.latLng(item.latitude, item.longitude),
      ),
    }));

    setSuggestionStations(
      allDistance.sort((a, b) => a.distance - b.distance).slice(0, 5),
    );
  };

  //返回建議站點列表
  const handleBackSuggestaion = () => {
    setIsStationInfo(false);
    setPopupStation(null); // 確保 popupStation 清空
    if (mapRef.current) {
      const map = mapRef.current;
      map.closePopup();
    }
  };

  //執行搜尋
  const handleSearchStations = (e) => {
    e.preventDefault();
    const matchStations = stations.filter(
      (item) =>
        item.station_name.includes(searchKeyWords) ||
        item.address.includes(searchKeyWords),
    );
    setSuggestionStations(matchStations);
    setSearchKeyWords("");
    setIsSideBar(true);
    setShowSuggestedTags(false);
    setIsStationInfo(false);
  };

  //取得搜尋建議tags
  const getAvailableTags = () => {
    let stationsName = stations.map((item) => item.station_name); // 取得所有站點名稱
    let stationsAddress = stations.map((item) => item.address); // 取得所有站點地址
    let tags = [...stationsName, ...stationsAddress]; //合併陣列
    setAvailableTags(tags); // 更新狀態
  };

  // Marker在不同螢幕下的執行動作
  const handleMarkerClick = (item) => {
    setPopupStation(item); // 設定選中的站點
    if (!isLg) {
      // 在小螢幕上直接開啟側邊欄
      setClickedId(item.id);
      setIsStationInfo(true);
      setIsSideBar(true);
    }
  };

  return (
    <>
      <MapNav
        handleLocateUser={handleLocateUser}
        searchKeyWords={searchKeyWords}
        setSearchKeyWords={setSearchKeyWords}
        handleSearchStations={handleSearchStations}
        availableTags={availableTags}
        showSuggestedTags={showSuggestedTags}
        setShowSuggestedTags={setShowSuggestedTags}
      />

      <div className="relative mx-auto flex justify-between lg:h-[700px] lg:flex-row">
        {/* 側邊欄 */}
        {isSideBar ? (
          <div className="scrollbar w-full flex-shrink-0 overflow-auto lg:w-[486px]">
            <button
              className="flex gap-[12px] px-[24px] py-[24px] lg:hidden"
              onClick={() => setIsSideBar(false)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <h5>回到地圖</h5>
            </button>

            {isStationInfo && station ? (
              <StationDetailedInfo
                station={station}
                countRecyclableBoxes={countRecyclableBoxes}
                countPendingBoxes={countPendingBoxes}
                formatPhoneNumber={formatPhoneNumber}
                handleBackSuggestaion={handleBackSuggestaion}
              ></StationDetailedInfo>
            ) : (
              <div className="flex flex-col gap-[8px] p-[24px] pt-0 lg:p-[24px]">
                {suggestionStations.map((item, index) => (
                  <SuggestionStationCard
                    station={item}
                    key={index}
                    countRecyclableBoxes={countRecyclableBoxes}
                    countPendingBoxes={countPendingBoxes}
                    formatPhoneNumber={formatPhoneNumber}
                    setClickedId={setClickedId}
                    mapRef={mapRef}
                    setIsStationInfo={setIsStationInfo}
                    setIsSideBar={setIsSideBar}
                    isLg={isLg}
                    markerRefs={markerRefs}
                    setPopupStation={setPopupStation}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}

        {/* 地圖 */}
        <div className="relative z-0 h-[calc(100vh-408.2px)] w-full md:h-[calc(100vh-264.2px)] lg:h-[700px]">
          <MapContainer
            // className="relative z-0"
            center={[stations[0].latitude, stations[0].longitude]} // 預設第一個站點
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            {/* 地圖圖層 */}
            <TileLayer
              url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
              attribution="Positron"
            />

            {/* 地圖上的標記 */}
            {stations.map((item) => (
              <Marker
                icon={createCustomIcon(item.station_name)}
                position={[item.latitude, item.longitude]}
                key={item.id}
                ref={(el) => (markerRefs.current[item.id] = el)} // 儲存 Marker 參照
                eventHandlers={{
                  click: () => {
                    handleMarkerClick(item); // 設定選中的站點
                  },
                }}
              >
                {isLg ? (
                  <Popup>
                    {popupStation ? (
                      <PopupCardLg
                        station={popupStation}
                        countRecyclableBoxes={countRecyclableBoxes}
                        countPendingBoxes={countPendingBoxes}
                        setIsStationInfo={setIsStationInfo}
                        setIsSideBar={setIsSideBar}
                        setClickedId={setClickedId}
                      ></PopupCardLg>
                    ) : (
                      <p>載入中...</p>
                    )}
                  </Popup>
                ) : (
                  <Popup>
                    {popupStation ? (
                      <PopupCard
                        station={popupStation}
                        countRecyclableBoxes={countRecyclableBoxes}
                        countPendingBoxes={countPendingBoxes}
                      ></PopupCard>
                    ) : (
                      <p>載入中...</p>
                    )}
                  </Popup>
                )}
              </Marker>
            ))}

            <UserLocation setUserLocation={setUserLocation} />

            {/* 側邊欄開關 */}
            <button
              className="absolute left-[0px] top-[273px] z-[999999999] hidden h-[72px] w-[40px] rounded-r-lg border-b border-e border-t bg-white lg:inline"
              onClick={() => setIsSideBar(!isSideBar)}
            >
              {isSideBar ? (
                <span className="material-symbols-outlined">chevron_left</span>
              ) : (
                <span className="material-symbols-outlined">chevron_right</span>
              )}
            </button>
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default Map;
