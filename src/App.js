import { useEffect, useContext, useState } from "react";
import { SocketContext } from "./socket";
import styled from "styled-components";
import { Table } from "antd";
import moment from "moment";

function App() {
  const { socket } = useContext(SocketContext);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const positiveStatus = [201, 200, 304];

  useEffect(() => {
    setIsLoading(true);
    socket.on("new_request", ({ request, response }) => {
      const modifiedPayload = {
        method: request.method,
        path: request.path,
        status: response.status,
        duration: request.duration,
        timestamp: request.timestamp,
      };

      setLogs((logs) => [modifiedPayload, ...logs]);
    });

    async function fetchData() {
      const { data } = await (
        await fetch("http://localhost:7000/horus/api/logs")
      ).json();

      setLogs([...data]);
      setIsLoading(false);
    }

    (async () => await fetchData())();
    return function () {
      socket.off("new_request");
    };
  }, []);

  const tableColumns = [
    {
      title: "VERB",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "PATH",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render(status) {
        return (
          <span
            className={`badge ${!positiveStatus.includes(status) ? "red" : ""}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "HAPPENED",
      dataIndex: "timestamp",
      key: "timestamp",
      render(timestamp) {
        return <span className="date">{moment(timestamp).fromNow()}</span>;
      },
    },
  ];

  return (
    <Layout>
      <div className="innerWrapper">
        <div className="liveSection">
          Live Monitoring : <button>Connected</button>
        </div>

        <TableWrapper
          loading={isLoading}
          pagination={{ position: ["bottomCenter"] }}
          dataSource={logs}
          columns={tableColumns}
        />
      </div>

      <Footer>
        Horus.js{" "}
        <a
          href="https://github.com/iamnasirudeen/horus"
          target="_blank"
          rel="noreferrer"
        >
          Repository
        </a>
      </Footer>
    </Layout>
  );
}

export default App;

const Footer = styled.div`
  padding: 1rem;
  text-align: center;
  background: #0d1117;
  color: #fff;
  font-family: DM Sans;

  a {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const Layout = styled.div`
  background-color: #edf2f7 !important;

  .innerWrapper {
    padding: 3rem;
  }

  .liveSection {
    margin-bottom: 2rem;
    font-family: DM Sans;
    font-size: 14px;
    font-weight: bold !important;

    button {
      background-color: #48bb78 !important;
      color: #fff !important;
      border: none;
      outline: none;
      border-radius: 5px;
      padding: 6px 10px 6px 10px;
    }
  }

  ul {
    background-color: #edf2f7;

    &.ant-pagination.ant-table-pagination.ant-table-pagination-right {
      margin-right: 20px !important;

      li {
        border-radius: 8px;

        &.ant-pagination-item-active {
          background: #0052cc !important;

          a {
            color: #ffffff !important;
          }
        }

        a {
          font-family: "Work Sans", sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          text-align: center;
        }
      }
    }
  }

  table {
    background-color: #edf2f7;

    thead {
      tr {
        th {
          font-family: DM Sans;
          font-style: normal;
          font-weight: bold;
          font-size: 12px;
          line-height: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: #ffffff;
          color: #8f92a1;
        }
      }
    }
    tbody {
      background: #ffffff;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
      tr {
        td {
          font-family: DM Sans;
          font-weight: bold;
          font-size: 13px;
          color: #171717;

          padding-top: 10px;
          padding-bottom: 10px;

          span.date {
            font-family: DM Sans;
            font-style: normal;
            font-weight: bold;
            font-size: 12px;
            line-height: 20px;
            text-align: right;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #8f92a1;
          }

          span.badge {
            padding: 0.2rem 0.5rem 0.2rem 0.5rem;
            background: #c6f6d5;
            opacity: 0.5;
            border-radius: 9999px;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            &.red {
              color: red !important;
              background: #fcdbdd !important;
            }
          }
        }
      }
    }
  }
`;

const TableWrapper = styled(Table)``;
