import React, { useState, useEffect } from "react";
import Select from "../../components/base/select/Select";
import {
  VictoryPie,
  VictoryLegend,
  VictoryTooltip,
  VictoryContainer,
} from "victory";
import {
  DashBoardActions,
  DashBoardSelectors,
} from "../../app/services/dashboard/dashboard.slice";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../app/function";
export default function DashBoarLeftChartPie() {
  const dispatch = useDispatch();
  const dataPie = useSelector(DashBoardSelectors.pie);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleMouseOver = (index) => {
    setActiveIndex(index);
  };

  const handleMouseOut = () => {
    setActiveIndex(null);
  };
  const DATA_PICK = [
    { name: "Tổng đơn hàng", value: "order" },
    { name: "Tổng tiền", value: "money" },
    { name: "Tổng doanh thu", value: "revenue" },
  ];
  const [values, setValues] = useState(DATA_PICK[0]);

  const amountTypeSelected = DATA_PICK.find(
    (type) => type?.name === values?.name
  );
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      dispatch(
        DashBoardActions.getDataPie({
          type: "order",
          onSuccess: (rs) => {
            setIsLoading(false);
          },
          onFail: (error) => {
            setIsLoading(false);
          },
        })
      );
    }
  }, []);
  const handleFetchTotal = (type) => {
    if (!isLoading) {
      setIsLoading(true);
      dispatch(
        DashBoardActions.getDataPie({
          type: type.value,
          onSuccess: (rs) => {
            setIsLoading(false);
          },
          onFail: (error) => {
            setIsLoading(false);
          },
        })
      );
    }
  };

  return (
    <div className="dashboard-left-pie-content">
      <div className="title-pie">
        <div className="title-balance">Thống kê nền tảng</div>
        <Select.Total
          canSearch={false}
          placeholder="Chọn tổng"
          data={DATA_PICK}
          selected={amountTypeSelected}
          setSelected={(type) => {
            handleFetchTotal(type);
            setValues(type);
          }}
        />
      </div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="loaderSmall"></div>
        </div>
      ) : (
        <div className="chart-content">
          <div className="chart">
            <VictoryPie
              radius={126}
              colorScale={dataPie?.colors}
              data={dataPie?.chart || []}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => `${datum.y}%`}
              labelRadius={({ innerRadius }) => innerRadius + 50}
              style={{
                data: {
                  fillOpacity: ({ index }) => (activeIndex === index ? 1 : 0.8),
                  cursor: "pointer",
                  stroke: "#fff",
                  strokeWidth: 0.5,
                },
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseOver: (evt, props) => {
                      handleMouseOver(props.index);
                      return [
                        {
                          target: "labels",
                          mutation: () => ({ active: true }),
                        },
                      ];
                    },
                    onMouseOut: () => {
                      handleMouseOut();
                      return [
                        {
                          target: "labels",
                          mutation: () => ({ active: false }),
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </div>
          <div className="note">
            <VictoryLegend
              orientation="horizontal"
              centerTitle
              gutter={10}
              itemsPerRow={5}
              data={(dataPie?.chart || []).map((item, index) => ({
                name: capitalizeFirstLetter(item.x),
                symbol: { fill: dataPie?.colors[index] },
              }))}
              style={{
                labels: { fontSize: 15 },
              }}
              containerComponent={<VictoryContainer responsive={false} />}
            />
          </div>
        </div>
      )}
    </div>
  );
}
