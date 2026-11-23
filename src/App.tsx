import { useEffect, useState } from "react"
import type { User } from "./type/types";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [users, setUsers] = useState<User[]>([]);

  const [nev, setNev] = useState<string>("")
  const [osztaly, setOsztaly] = useState<string>("")

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data: User[] = await response.json();
        setUsers(data)
      } catch (error) {
        console.log("Hiba történt: " + error.message);
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
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(ujFelhasznalo)
      });
      if (!response.ok) {
        throw new Error("A felvétel nem sikerült.");
        
      }
      const felhasznalo: User = await response.json();
      setUsers((elozo) => [...elozo, felhasznalo]);
      setNev("");
      setOsztaly("");
    } catch (error) {
      console.log("Hiba történt felvételnél: " + error.message)
    }
  }

  async function handleTorles(id: string) {
    if (!confirm("Biztosan szeretnéd törölni ezt a felhasználót?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + id, {
        method: "DELETE"
      })
      if (!response.ok) {
        throw new Error("A törlés nem működik.");      
      }
      setUsers((elozo) => elozo.filter((user) => user.id.toString() !== id))
    } catch (error) {
      console.log("Hiba" + error.message)

    }
  }

  async function handleCreditUp(user: User) {
    if (!confirm("Biztosan szeretnéd 1000-el megemelni " + user.nev + " osztálypénzét?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({kredit: user.kredit + 1000})
      });
      if (!response.ok) {
        throw new Error("A kredit emelés nem sikerült."); 
      }
      setUsers((elozo) =>
        elozo.map(u =>
          u.id === user.id ? {...u, kredit: user.kredit+1000} : u,
        )
      );
    } catch (error) {
      console.log("Hiba" + error.message)
    }
  }

    async function handleCreditDown(user: User) {
    if (!confirm("Biztosan szeretnéd 1000-el csökkenteni  " + user.nev + " osztálypénzét?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({kredit: user.kredit - 1000})
      });
      if (!response.ok) {
        throw new Error("A kredit csökkentés nem sikerült."); 
      }
      setUsers((elozo) =>
        elozo.map(u =>
          u.id === user.id ? {...u, kredit: user.kredit-1000} : u,
        )
      );
    } catch (error) {
      console.log("Hiba" + error.message)
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
            <th>Kredit</th>
            <th>Tanköteles</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nev}</td>
              <td>{user.osztaly}</td>
              <td>{user.kredit}</td>
              <td>{user.tankoteles ? "Tanköteles" : "Nem tanköteles"}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleTorles(user.id.toString())}>❌</button>
                <button className="btn" onClick={() => handleCreditUp(user)}>+1000</button>
                <button className="btn" onClick={() => handleCreditDown(user)}>-1000</button>
              </td>
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
            onChange={(e) => setNev(e.target.value)} />
          <br />
        </label>
        <br />
        <label htmlFor="input_osztaly">
          Add meg a oszályod: <br />
          <input
            id="input_osztaly"
            type="text"
            value={osztaly}
            onChange={(e) => setOsztaly(e.target.value)} />
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