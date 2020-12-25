import React, { useState, useEffect } from 'react';
import { login, getDevices, addDevice, getSensors, addSensor } from './api';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, } from '@material-ui/core';
import logo from './logo.svg';
import './App.css';


const LOGIN = 0, HOME = 1, SELECT_DEVICE = 2, CREATE_SENSOR = 3, CREATE_DEVICE = 4;

function App() {

  const [user, setUser] = useState(-1);
  const [currentScreen, setCurrentScreen] = useState(-1);
  const [refreshDevice, setRefreshDevice] = useState(false);

  let token = localStorage.getItem('token');
  if (token && currentScreen === -1) {
    let device = localStorage.getItem("device");
    if (device) {
      setCurrentScreen(HOME);
    } else
      setCurrentScreen(SELECT_DEVICE);
  } else if (currentScreen === -1) {
    setCurrentScreen(LOGIN);
  }

  if (token && user === -1) {
    setUser(JSON.parse(localStorage.getItem('user')));
  }
  const LOGINJSX = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const doLogin = () => {
      login({ email, password })
        .then(res => {
          if (res.data.status === "OK") {
            localStorage.setItem('token', res.data.jwtToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setCurrentScreen(SELECT_DEVICE);
          }
        }).catch(e => alert(e.toString()));
    }
    return <div className="mainLogin">
      <Card className="loginBoxMain">
        <h1>Login</h1>
        <h4>Please login with your existing Analytica.IoT account</h4>
        <FormControl className="inputField">
          <TextField value={email} onChange={e => setEmail(e.target.value)} label="Email" className="inputField" variant="outlined" type="email" />
        </FormControl>
        <FormControl className="inputField">
          <TextField value={password} onChange={e => setPassword(e.target.value)} label="Password" className="inputField" variant="outlined" type="password" />
        </FormControl>
        <Button onClick={doLogin} style={{ alignSelf: 'flex-end', paddingLeft: 30, paddingRight: 30 }} variant="contained" color="primary">Login</Button>
      </Card>
    </div>;
  }
  const CREATESENSOR = () => {
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);
    const [pin, setPin] = useState(null);


    const onAddSensor = () => {
      let payload = {
        id, name, type: `PIN_${pin}`
      };
      getSensors(localStorage.getItem('device'))
        .then(res => {
          if (res.data.success) {
            payload.device = res.data.device.id;
            addSensor(payload)
              .then(res => {
                if (res.data.success) {
                  alert("Added sensor successfully");
                  setRefreshDevice(true);
                } else {
                  alert(res.data.message);
                }
              })
          }
        })

    }

    return <div className="mainLogin">
      <Card className="loginBoxMain">
        <h1>Create Sensor</h1>
        <h4>Please enter required information to add this sensor to your device</h4>
        <FormControl className="inputField">
          <TextField value={name} onChange={e => setName(e.target.value)} label="Name" className="inputField" variant="outlined" type="text" />
        </FormControl>
        <FormControl className="inputField">
          <TextField value={id} onChange={e => setId(e.target.value)} label="ID" className="inputField" variant="outlined" type="text" />
        </FormControl>
        <FormControl className="inputField">
          <TextField value={pin} onChange={e => setPin(e.target.value)} label="PIN" className="inputField" variant="outlined" type="text" />
        </FormControl>
        <div style={{ display: 'flex', justifySelf: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', margin: 20 }}>
          <Button variant="outlined" onClick={() => setCurrentScreen(HOME)} color="secondary">BACK</Button>
          <Button variant="contained" onClick={onAddSensor} color="primary">Create</Button>
        </div>
      </Card>
    </div>;
  }
  const CREATEDEVICE = () => {
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);

    const onAddDevice = () => {
      let payload = {
        id, name
      };
      addDevice(payload)
        .then(res => {
          if (res.data.success) {
            alert("Added Device Successfully");
            setCurrentScreen(SELECT_DEVICE);
            setRefreshDevice(true);
          } else {
            alert(res.data.message);
          }
        })
    }

    return <div className="mainLogin">
      <Card className="loginBoxMain">
        <h1>Create Device</h1>
        <h4>Please enter required information to add this device to your Analytica.IoT account</h4>
        <FormControl className="inputField">
          <TextField value={name} onChange={e => setName(e.target.value)} label="Name" className="inputField" variant="outlined" type="text" />
        </FormControl>
        <FormControl className="inputField">
          <TextField value={id} onChange={e => setId(e.target.value)} label="ID" className="inputField" variant="outlined" type="text" />
        </FormControl>
        <div style={{ display: 'flex', justifySelf: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', margin: 20 }}>
          <Button variant="outlined" onClick={() => setCurrentScreen(SELECT_DEVICE)} color="secondary">BACK</Button>
          <Button variant="contained" onClick={onAddDevice} color="primary">Create</Button>
        </div>
      </Card>
    </div>;
  }

  const SELECTDEVICE = () => {
    const [devices, setDevices] = useState(null);
    const [device, setDevice] = useState(null);
    const selectDevice = () => {
      if (device) {
        localStorage.setItem("device", device);
        setCurrentScreen(HOME);
      } else {
        alert("Please select device");
      }
    }
    useEffect(() => {
      if (devices === null || refreshDevice) {
        getDevices()
          .then(res => {
            if (res.data.success) {
              setDevices(res.data.devices);
              setRefreshDevice(false);
            }
          });
      }
    }, []);
    return <div className="mainLogin">
      <Card className="loginBoxMain">
        <h1>Select Device</h1>
        <h4>Select a device to continue or create a new device to associate with this device</h4>
        <FormControl className="inputField">
          <InputLabel id="Device">Device</InputLabel>
          {devices &&
            <Select value={device} onChange={e => setDevice(e.target.value)} labelId="Device">
              {devices.map(device => (
                <MenuItem value={device._id}>{device.id}</MenuItem>))}
            </Select>}
        </FormControl>
        <div style={{ display: 'flex', justifySelf: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', margin: 20 }}>
          <Button variant="outlined" onClick={() => setCurrentScreen(CREATE_DEVICE)} color="secondary">Create</Button>
          <Button variant="contained" onClick={selectDevice} color="primary">Select</Button>
        </div>
      </Card>
    </div >
  }
  const HOMEJSX = () => {
    const [sensors, setSensors] = useState(null);

    const fetchSensors = () => {
      let device = localStorage.getItem("device");
      if (device) {
        getSensors(device)
          .then(res => {
            if (res.data.success) {
              setSensors(res.data.sensors);
            }
          })
      }
    }

    useEffect(() => {
      if (sensors === null) {
        setInterval(fetchSensors(), 3000);
      }
    }, [sensors]);
    return <div className="sensorMain">
      <h1>Sensors</h1>

      <TableContainer component={Paper}>
        <Table style={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='right'>ID</TableCell>
              <TableCell align='right'>Unique</TableCell>
              <TableCell align='right'>Current Value</TableCell>
              <TableCell align='right'> Pin</TableCell>
            </TableRow>

          </TableHead>
          <TableBody>
            {sensors && sensors.map(sensor => {
              return <TableRow key={sensor.id}>
                <TableCell component="th" scope="row">{sensor.name}</TableCell>
                <TableCell align='right'>{sensor.id}</TableCell>
                <TableCell align='right'>{sensor._id}</TableCell>
                <TableCell align='right'>{sensor.lastUpdate ? sensor.lastUpdate.value : ""}</TableCell>
                <TableCell align='right'>{/PIN_/.test(sensor.type) ? sensor.type.split("_")[1] : ""}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button onClick={() => setCurrentScreen(CREATE_SENSOR)} variant="contained" color="primary">Create Sensor</Button>
    </div>
  }

  return (
    <div className="App">
      {currentScreen === LOGIN ? <LOGINJSX /> : <div className="homeMain">
        <Paper className="header">
          <h2>Welcome, {user.name}</h2>
          <Button variant="outlined" onClick={() => {
            setCurrentScreen(LOGIN);
            localStorage.clear();

          }} color="warning">Sign Out</Button>
        </Paper>
        <div className="content">
          {currentScreen === SELECT_DEVICE ? <SELECTDEVICE /> : currentScreen === CREATE_DEVICE ? <CREATEDEVICE /> : currentScreen === HOME ? <HOMEJSX /> : currentScreen === CREATE_SENSOR ? <CREATESENSOR /> : <LOGINJSX />}
        </div>
      </div>}
    </div>
  );
}

export default App;
