import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import illustration from "./assets/illustration.png";
import logo from "./assets/logo.png";
import updateImg from "./assets/update.png";
import deleteImg from "./assets/delete.png";
import axios from "axios";

function App() {
  const [updateClicked, setUpdateClicked] = useState(false);
  const [addClicked, setAddClicked] = useState(false);
  const [clients, setClients] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [request, setRequest] = useState(false);
  const [client, setClient] = useState([]);

  // add new client input Refs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  // update client input Refs
  const udpateNameRef = useRef(null);
  const udpateEmailRef = useRef(null);
  const udpatePhoneRef = useRef(null);
  const udpateSmsStatRef = useRef(null);
  const udpateEmailStatRef = useRef(null);

  const api = axios.create({ baseURL: "http://localhost:8000/" });

  useEffect(() => {
    async function fetchClients() {
      const request = await api.get("/clients");
      console.log(request.data);

      setClients(request.data);
      return request;
    }
    fetchClients();
  }, [postSuccess, request]);

  async function postData(name, email, phone) {
    const request = await api
      .post("/clients", {
        name: name,
        email: email,
        cellPhone: phone,
      })
      .then((res) => {
        console.log(res);
        setPostSuccess(true);
        setAddClicked(false);
      });
  }

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;

    console.log("name:", name, "email:", email, "phone: ", phone);
    postData(name, email, phone);
  };

  // console.log("Clients: ", clients);

  // Update
  const handleUpdate = (id, name, email, number, smsStatus, emailStatus) => {
    setUpdateClicked(true);
    console.log("client name: ", name);
    setClient([]);
    setClient([{ id, name, email, number, smsStatus, emailStatus }]);
  };
  // console.log("individual client", client);

  const submitUpdate = (id, num) => {
    // e.preventDefault();
    const name = udpateNameRef.current.value;
    const email = udpateEmailRef.current.value;
    const phone = udpatePhoneRef.current.value;
    const emailStatus = udpateEmailStatRef.current.value;
    const smsStatus = udpateSmsStatRef.current.value;

    const initialSmsStat = client[0].smsStatus;
    console.log("update number: ", num);

    // checking if the sms status has changed
    if (smsStatus !== initialSmsStat) {
      // updatestatus for all numbers which are the same
      updateAllNumStat(num);
    }

    async function updateAllNumStat(num) {
      console.log("updating number: ", num);
      await api
        .put(`cellPhone/${num}`, {
          smsStatus: smsStatus,
        })
        .then((res) => {
          console.log(res.data);
          setRequest(!request);
        })
        .catch((err) => console.log(err.data.message));
    }

    // console.log("update id: ", id);

    async function UpdateClient(id) {
      console.log("updating data sms Status", smsStatus !== initialSmsStat);
      await api
        .put(`/clients/${id}`, {
          name: name,
          email: email,
          cellPhone: phone,
          emailStatus: emailStatus,
          smsStatus: smsStatus,
        })
        .then((res) => {
          console.log(res.data);
          setRequest(!request);
          setUpdateClicked(false);
        })
        .catch((err) => console.log(err.message));
    }

    UpdateClient(id);
  };

  // Delete
  const deleteClient = async (id) => {
    console.log("delete clicked  id:", id);
    await api
      .delete(`/clients/${id}`)
      .then((res) => {
        console.log(res);
        setRequest(!request);
      })
      .catch((err) => {
        console.log(err.message);
      });
    // setSuccess(false);
  };

  return (
    <div className="App grid">
      <aside className="sidebar flex-center">
        <div className="logo">
          <img src={logo} alt="Pulseem" />
        </div>
        {/* illustration */}
        <div className="illustration">
          <img src={illustration} alt="illustration" />
        </div>
      </aside>

      <main className="mainContent">
        <p
          className="prompt"
          style={postSuccess ? { opacity: 1, top: "2%" } : {}}
        >
          Client added successfully
        </p>
        {postSuccess &&
          setTimeout(() => {
            setPostSuccess(false);
          }, 2000)}
        {updateClicked && (
          <div className="updateClientModal" data-update-modal>
            <button id="close" onClick={() => setUpdateClicked(false)}>
              X
            </button>
            <h2 className="text-center mb-1">Update Client</h2>
            <form action="#" className="modal">
              <div className="field">
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  id="name"
                  placehodler="Enter name "
                  defaultValue={client[0].name}
                  ref={udpateNameRef}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email: </label>
                <input
                  type="email"
                  id="email"
                  placehodler="Enter your email"
                  defaultValue={client[0].email}
                  ref={udpateEmailRef}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone: </label>
                <input
                  type="tel"
                  id="phone"
                  placehodler="Enter phone number "
                  defaultValue={client[0].number}
                  ref={udpatePhoneRef}
                />
              </div>
              <div className="field">
                <label htmlFor="emailStatus">Email Status: </label>
                <select id="emailStatus" ref={udpateEmailStatRef}>
                  <option value={client[0].emailStatus}>
                    {client[0].emailStatus}
                  </option>
                  <option
                    value={
                      client[0].emailStatus == "active" ? "removed" : "active"
                    }
                  >
                    {client[0].emailStatus == "active" ? "removed" : "active"}
                  </option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="smsStatus">Sms Status: </label>
                <select id="smsStatus" ref={udpateSmsStatRef}>
                  <option value={client[0].smsStatus}>
                    {client[0].smsStatus}
                  </option>
                  <option
                    value={
                      client[0].smsStatus == "active" ? "removed" : "active"
                    }
                  >
                    {client[0].smsStatus == "active" ? "removed" : "active"}
                  </option>
                </select>
              </div>

              <div className="submit flex-center">
                <input
                  className="btn"
                  type="submit"
                  value="Submit"
                  onClick={() => submitUpdate(client[0].id, client[0].number)}
                />
              </div>
            </form>
          </div>
        )}

        {addClicked && (
          <div className="addClientModal" data-add-modal>
            <button id="close" onClick={() => setAddClicked(false)}>
              X
            </button>
            <h2 className="text-center mb-1">Add Client</h2>
            <form action="#" className="modal">
              <div className="field">
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  id="name"
                  placehodler="Enter name "
                  ref={nameRef}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email: </label>
                <input
                  type="email"
                  id="email"
                  placehodler="Enter your email"
                  required
                  ref={emailRef}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone: </label>
                <input
                  type="tel"
                  id="phone"
                  placehodler="Enter phone number "
                  required
                  ref={phoneRef}
                />
              </div>

              <div className="submit flex-center">
                <input
                  className="btn"
                  type="submit"
                  value="Submit"
                  required
                  onClick={handleSubmit}
                />
              </div>
            </form>
          </div>
        )}

        {/* header */}
        <div class="header flex-between">
          <h2 class="title">Clients</h2>
          <div>
            <a
              href="#"
              class="btn"
              id="addBtn"
              onClick={() => setAddClicked(true)}
            >
              Add Client
              <span>
                <img src="assets/add.png" alt="" />
              </span>
            </a>
          </div>
        </div>
        {/* ------ */}

        <div className="clientList">
          {/* card */}
          {clients.map((client) => (
            <div class="client card">
              <p>{client.name}</p>
              <p>{client.email}</p>
              <p>{client.cellPhone}</p>
              <p>{client.smsStatus}</p>
              <p>{client.emailStatus}</p>

              <div class="actions">
                <a
                  href="#/"
                  id="updateBtn"
                  onClick={() =>
                    handleUpdate(
                      client._id,
                      client.name,
                      client.email,
                      client.cellPhone,
                      client.smsStatus,
                      client.emailStatus
                    )
                  }
                >
                  <img src={updateImg} alt="update" />
                </a>
                <a
                  href="#/"
                  id="deleteBtn"
                  onClick={() => deleteClient(client._id)}
                >
                  <img src={deleteImg} alt="delete" />
                </a>
              </div>
            </div>
          ))}
          {/* <div class="client card">
            <p>Kojo Kewa Junior</p>
            <p>kojokewajunior123@gmail.com</p>
            <p>0554378923</p>
            <div class="actions">
              <a
                href="#/"
                id="updateBtn"
                onClick={() => setUpdateClicked(true)}
              >
                <img src={updateImg} alt="update" />
              </a>
              <a href="#/" id="deleteBtn">
                <img src={deleteImg} alt="delete" />
              </a>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default App;
