import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MealActions,
  MealSelectors,
} from "../../app/services/meal/meal.slice"
import { formatPriceVND } from "../../app/utils/format";
import Pagination from "../../components/base/pagination/Pagination";
import Table from "../../components/base/table/Table";
import MealDeleteModal from "./Meal.Options";
import "./style.css";
import moment from "moment/moment";

function MealList() {
  const dispatch = useDispatch();
 
  const mealList = useSelector(MealSelectors.mealList ) || [];
  const pagination = useSelector(MealSelectors.pagination);

  useEffect(() => {
    dispatch(MealActions.getMeals());
  }, [pagination.page]);

  useEffect(() => {
    console.log('Data:', mealList)
  }, []);

  const thead = [
    { name: "STT", style: { width: 20 }, className: "" },
    { name: "Tên gói ăn", style: { width: 120 } },
    { style: { textAlign: "left" }, name: "Tên khách hàng" },
    { name: "Khung giờ", style: { width: 120 } },
    { name: "Ngày giao", style: { width: 120 } },
    { name: "Trạng thái", style: { width: 120 } },
    { name: "Thao tác", style: { width: 100 } },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Đang chờ', color: 'orange' };
      case 'done':
        return { text: 'Hoàn thành', color: 'green' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'red' };
      case 'inprogress':
        return { text: 'Đang xử lý', color: 'blue' };
      default:
        return { text: 'Không xác định', color: 'gray' };
    }
  };

  const genDataTable = () => {
    try {
      return mealList.map((x, index) => {
        const status = getStatusStyle(x.status);

        return [
          { value: (pagination.page - 1) * pagination.pageSize + (index + 1) },
          { style: { textAlign: "left" }, value: x.subDescription.name }, // Tên gói ăn
          { value: x.customerID.email }, // Tên khách hàng
          { value: x?.estimatedTime}, // Khung giờ
          { value: moment(x.createdAt).format("HH:mm DD/MM/YYYY") }, // Ngày giao
          {
            value: status.text,
            style: { color: status.color }, // Trạng thái
          },
          { value: <MealDeleteModal id={x._id} /> }, // Thao tác
        ];
      });
    } catch (error) {
      return [];
    }
  };

  return (
    <div style={{marginTop:'10px'}}>
      <Table head={thead} body={genDataTable()} />
      <div className="meal-pagination">
        <Pagination
          {...pagination}
          onChange={(page) => {
            dispatch(
              MealActions.setPagination({
                ...pagination,
                page,
              })
            );
          }}
        />
      </div>
    </div>
  );
}

export default MealList;
