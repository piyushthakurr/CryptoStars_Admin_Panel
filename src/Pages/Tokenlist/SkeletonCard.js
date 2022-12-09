import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { Table } from "react-bootstrap";

const SkeletonCard = () => {
  const a=[1,2,3,4,5,6,7,8,9,10]
    return (
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Token Name</th>
          <th>Symbol</th>
          <th>Address</th>
          <th>Total Supply</th>
        </tr>
      </thead>

      {a?.map((item) => (
        <tbody>
          <tr key={item}>
            <td>{<Skeleton/>}</td>
            <td>{<Skeleton/>}</td>
            <td>
              <p>
                <span id={btoa(item?.item)}>{<Skeleton/>}</span>
              </p>
            </td>
            <td>{<Skeleton/>}</td>
          </tr>
        </tbody>
      ))}
    </Table>
    );
  };

  export default SkeletonCard;
