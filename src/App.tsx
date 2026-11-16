import { useEffect, useState } from "react"
import type { User } from "./type/types";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [users, setUsers] = useState<User[]>([]);

  const [nev, setNev] = useState<string>("")
  const [osztaly, setOsztaly] = useState<string>("")

  useEffect(()=> {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data: User[] = await response.json();
        setUsers(data)
      } catch(err) {
        console.log("Hiba történt: " + err.message);
      }
    }
    fetchUsers();
  }, []);

  async function handleFelhasznaloFelvetel(e) {
    e.preventDefault();
    const ujFelhasznalo = {
      nev: nev,
      osztaly: osztaly
    }
    try {
      const response = await fetch("http://localhost:3000/users", {
        "method": "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(ujFelhasznalo)
      });
      const felhasznalo: User = await response.json();
      setUsers((elozo)=>[...elozo, felhasznalo]);
      setNev("");
      setOsztaly("");
    } catch (err){
      console.log("Hiba történt felvételnél: " + err.message)
    }
  }

  return (
    <>
    <h1>Felhasználók</h1>
    <h2>Felhasználók listájsa</h2>
    <table className="table table-hover table-bordered">
      <thead>
        <tr>
          <th>Név</th>
          <th>Osztály</th>
        </tr>
      </thead>
      <tbody>
        {users.map( (user) => (  
          <tr key={user.id}>
            <td>{user.nev}</td>
            <td>{user.osztaly}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Felhasználók felvétele</h2>
    <form onSubmit={handleFelhasznaloFelvetel}>
      <label htmlFor="input_nev">
        Add meg a neved: <br />
      <input 
      id="input_nev" 
      type="text" 
      value={nev} 
      onChange={(e)=> setNev(e.target.value)}/>
      <br />
      </label>
      <br />
      <label htmlFor="input_osztaly">
        Add meg a oszályod: <br />
      <input 
      id="input_osztaly" 
      type="text" 
      value={osztaly} 
      onChange={(e)=> setOsztaly(e.target.value)}/>
      <br />
      </label>
      <br />
      <button type="submit">Felvétel</button>
    </form>
    </>
  )
}

export default App

// npm install json-server -D