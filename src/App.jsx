import { useState, useEffect, useCallback } from 'react'
import './index.css'
import { BiCalendar } from "react-icons/bi";
import Search from './components/Search';
import AddAppointment from './components/Appointment'
import AppointmentInfo from './components/AppointmentInfo';



function App() {
  let [appointments, setAppointments] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("ownerName");
  let [orderBy, setOrderBy] = useState('asc')

  const filteredAppointments = appointments.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order : 1 * order
    )
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointments(data)
      })

  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <div className="App container mx-auto mt-3 font-thin">

        <h1 className="text-5xl mb-3">
          <BiCalendar className="inline-block text-red-400 align-top" />Your Appointments</h1>
        <AddAppointment
          onSendAppointment={myAppointment => setAppointments([...appointments, myAppointment])}
          lastId={appointments.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
        />
        <Search query={query}
          onQueryChange={myQuery => setQuery(myQuery)}
          orderBy={orderBy}
          onOrderByChange={mySort => setOrderBy(mySort)}
          sortBy={sortBy}
          onSortByChange={mySort => setSortBy(mySort)}

        />

        <ul className='divide-y divide-gray-200'>
          {filteredAppointments
            .map(appointment => (
              <AppointmentInfo key={appointment.id}
                appointment={appointment}
                onDeleteAppointment={
                  appointmentId =>
                    setAppointments(appointments.filter(appointment =>
                      appointment.id !== appointmentId))
                }
              />
            ))
          }
        </ul>
      </div>

    </>
  )
}

export default App
