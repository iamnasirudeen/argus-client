import { useEffect, useContext, useState } from "react";
import { SocketContext } from "./socket";
import styled from "styled-components";
import { Table, Drawer, Tabs } from "antd";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import JSONPretty from "react-json-pretty";

function App() {
  const { socket } = useContext(SocketContext);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [singleLogData, setSingleLogData] = useState(null);
  const [totalResults, setTotalResults] = useState(1);
  // const [pageLimit, setPageLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1)

  const positiveStatus = [201, 200, 304];

  const { TabPane } = Tabs;
  async function fetchData(page = 1 ) {
    const { data, record } = await (await fetch(`http://localhost:5000/logs/api/logs?page=${page}`)).json();
    setTotalResults(record.total)
    setCurrentPage(record.current)
    setLogs([...data]);
    setIsLoading(false);
  }
  useEffect(() => {
    setIsLoading(true);
    socket.on("new_request", (data) => {
      const { request, response } = data;
      const modifiedPayload = {
        logId: data._id,
        method: request.method,
        path: request.path,
        status: response.status,
        duration: request.duration,
        timestamp: request.timestamp,
      };

      setLogs((logs) => [modifiedPayload, ...logs]);
    });

  

    (async () => await fetchData())();
    return function () {
      socket.off("new_request");
    };
  }, []);

  async function viewLogInfo(logId) {
    console.log(logId);
    setIsLoading(true);

    const { data } = await (await fetch(`/argus/api/logs/${logId}`)).json();
    setSingleLogData(data);
    setIsLoading(false);
    handleDrawerStatus();
  }

  function handleDrawerStatus() {
    setDrawerStatus(!drawerStatus);
  }

  const tableColumns = [
    {
      title: "METHOD",
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
      title: "TIMESTAMP",
      dataIndex: "timestamp",
      key: "timestamp",
      render(timestamp) {
        return <span className="date">{moment(timestamp).format()}</span>;
      },
    },
    {
      title: "VIEW LOG",
      dataIndex: "logId",
      key: "logId",
      render(logId) {
        return (
          <EyeOutlined className="viewLog" onClick={() => viewLogInfo(logId)} />
        );
      },
    },
  ];
  const onChange = (page)=> {
    setCurrentPage(page)
    fetchData(page)
  };
  return (
    <Layout>
      <div className="innerWrapper">
        <div className="liveSection">
          Live Monitoring : <button>Connected</button>
        </div>

        <TableWrapper
          loading={isLoading}
          pagination={{ 
            position: ["bottomCenter"], pageSize: 10, total: totalResults, 
            showQuickJumper: true, showSizeChanger: false, current: currentPage,
            onChange: onChange,
        }}
          dataSource={logs}
          columns={tableColumns}
        />
      </div>

      <Footer>
        Argus Logger{" "}
        <a
          href="https://github.com/iamnasirudeen/argus"
          target="_blank"
          rel="noreferrer"
        >
          Repository
        </a>
      </Footer>

      <CustomDrawer
        width={450}
        title="Request & Response Details"
        placement={"left"}
        onClose={handleDrawerStatus}
        visible={drawerStatus}
      >
        <p>Hostname: {singleLogData?.request?.hostname}</p>
        <p>Client IP: {singleLogData?.request?.ipAddress}</p>
        <p>Method: {singleLogData?.request?.method}</p>
        <p>Status: {singleLogData?.response?.status}</p>
        <p>Path: {singleLogData?.request?.path}</p>
        <p>URL: {singleLogData?.request?.url}</p>
        <p>Time Spent: {singleLogData?.request?.duration}</p>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Payload" key="1">
            <JSONPretty
              themeClassName="theme"
              data={singleLogData?.request?.body?.[0] || {}}
            ></JSONPretty>
          </TabPane>
          <TabPane tab="Headers" key="2">
            <JSONPretty
              themeClassName="theme"
              data={singleLogData?.request?.headers?.[0] || {}}
            ></JSONPretty>
          </TabPane>
          <TabPane tab="Responses" key="3">
            <JSONPretty
              themeClassName="theme"
              data={singleLogData?.response?.body?.[0] || {}}
            ></JSONPretty>
          </TabPane>
        </Tabs>
      </CustomDrawer>
    </Layout>
  );
}

export default App;

const CustomDrawer = styled(Drawer)`
  font-family: DM Sans;
  font-weight: bold;

  .theme {
    padding: 1rem;
    background: #252526;
    font-family: Consolas, "Courier New", monospace;
    font-weight: normal;
    font-size: 13px;
    font-feature-settings: "liga", "calt";
    line-height: 18px;
    letter-spacing: 0px;
    color: #d4d4d4;
    border-radius: 10px;

    .__json-key__ {
      color: #9cdcfe;
    }

    .__json-value__ {
      color: #9cdcfe !important;
    }

    .__json-string__ {
      color: #b5cea8;
    }
    .__json-boolean__ {
      color: #569cd6;
    }
  }
`;

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

  .viewLog {
    font-size: 20px;
    color: green;
    opacity: 0.8;
  }

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
