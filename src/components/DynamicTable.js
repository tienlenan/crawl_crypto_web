import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@material-ui/core/Box";

import MUIDataTable from "mui-datatables";
import Icon from "react-crypto-icons";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

const muiCache = createCache({
  key: "mui",
  prepend: true,
});

const columns = [
  {
    name: "id",
    label: "No.",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "network",
    label: "Network",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <>
          <Box
            sx={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              height: 24,
            }}
          >
            <Icon name={value.toLowerCase()} size={16} />
            &nbsp;&nbsp;
            <span>{value}</span>
          </Box>
        </>
      ),
    },
  },
  {
    name: "symbol",
    label: "Symbol",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "supply",
    label: "Supply",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <NumberFormat
          displayType={"text"}
          thousandSeparator={true}
          value={(parseInt(value) / 1000000).toFixed(2)}
        />
      ),
    },
  },
  {
    name: "source",
    label: "Source",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <a href={value} target="_blank" style={{ color: "black" }}>
          {value}
        </a>
      ),
    },
  },
];

const options = {
  filterType: "checkbox",
};

export default function DynamicTable() {
  const [currencies, setCurrencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onError = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const endpoint =
      "https://ij57xwsjvsos3rcyvj5gqkynwm0bonwo.lambda-url.ap-southeast-1.on.aws/";
    axios
      .get(endpoint)
      .then((res) => {
        setCurrencies(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        onError;
      });
  }, []);

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  ) : (
    <>
      <CacheProvider value={muiCache}>
        <MUIDataTable data={currencies} columns={columns} options={options} />
      </CacheProvider>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Can't get crypto data
        </Alert>
      </Snackbar>
    </>
  );
}
