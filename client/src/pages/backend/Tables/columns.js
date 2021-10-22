export const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", editable: true, width: 170 },
  { field: "username", headerName: "Username", editable: true, width: 170 },
  { field: "email", headerName: "E-mail", width: 200 },
  { field: "address", headerName: "Address", width: 250, 
    renderCell: (params) => (
      <span>{params.value.zipcode}, {params.value.city}, {params.value.street}</span>
    ),
  },
  { field: "company", headerName: "Company", width: 200, 
    renderCell: (params) => (
      <span>{params.value.name}</span>
    ),
  },
  { field: "website", headerName: "Website", width: 200, 
    renderCell: (params) => (
      <a href={"https://"+params.value}
      target="_blank"
      rel="noreferrer"
      color="primary"
      style={{ marginLeft: 16 }}
      >
        {params.value}
      </a>
    ),
  },
];