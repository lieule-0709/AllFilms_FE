import React, { useState, useEffect } from 'react'
import { BookTicketWrapper } from './styles'
import {
  Button,
  Divider,
} from 'antd'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../redux/data/slice';
import { getDetailSession, getCategory, bookTicket, getFilm } from '../../redux/data/actions';
import moment from 'moment';
import { useHistory } from "react-router-dom";

const BookTicket = () => {

  const dispatch = useDispatch();
  const { id } = useParams();
  var history = useHistory();

  const categories = useSelector(state => state.data.categories) || []
  const detailSession = useSelector(state => state.data.detailSession)
  const film = useSelector(state => state.data.film)
  const bookedSeats = detailSession.bookedSeats || ""
  const token = useSelector(state => state.token.token)

  const [step, setStep] = useState('1')
  const [sum, setSum] = useState(0)
  const [countTicket, setCountTicket] = useState(0)
  const [foodDrinks, setFoodDrinks] = useState([])

  const filmId = detailSession?.filmId;

  useEffect(() => {
    dispatch(getDetailSession(id))
    dispatch(getCategory())
    dispatch(getFilm(filmId))
  }, [filmId])

  const [fdStr, setFdStr] = useState("")
  const [seats, setSeats] = useState([])
  const rows = []
  const cols = []

  rows.length = detailSession?.Room?.row || 0
  rows.fill(1)
  cols.length = detailSession?.Room?.column || 0
  cols.fill(1)

  const changeBg = (e) => {
    if (seats.length <= countTicket && countTicket !== 0) {
      if (e.target.classList.contains("bgGreen")) {
        setSeats(seats.filter(item => item !== e.target));
        e.target.classList.remove("bgGreen")
      }
      else if (!e.target.classList.contains("bgRed")) {
        if (seats.length < countTicket) {
          e.target.classList.add("bgGreen")
          seats.push(e.target)
        }
        else {
          seats[0]?.classList.remove("bgGreen")
          seats.shift()
          e.target.classList.add("bgGreen")
          seats.push(e.target)
        }
      }
    }

    setSeats(seats)
  }

  const change = (e) => {
    e.target.parentElement.parentElement.childNodes[3].childNodes[0].textContent = e.target.value * e.target.parentElement.parentElement.childNodes[2].childNodes[0].textContent;
    const ticketPrices = document.getElementsByClassName("ticket-price")
    const ticketNums = document.getElementsByClassName("ticketNum")
    var sum = 0
    for (let i = 0; i < ticketPrices.length; i++) {
      sum = sum + ticketPrices[i].innerText * 1
    }
    document.getElementById("ticketSum").innerText = sum

    var sum1 = 0
    e.target.parentElement.parentElement.childNodes[3].childNodes[0].textContent = e.target.value * e.target.parentElement.parentElement.childNodes[2].childNodes[0].textContent;
    const comboPrices = document.getElementsByClassName("combo-price");
    for (let i = 0; i < comboPrices.length; i++) {
      sum1 = sum1 + comboPrices[i].innerText * 1
    }
    document.getElementById("comboSum").innerText = sum1
    setSum(sum1 + sum)

    var fds = []
    var fdstr = "  |  "
    const combos = document.getElementsByClassName("fds");
    for (let i = 0; i < combos.length; i++) {
      let id = combos[i].id
      if (combos[i].value !== "0") {
        fds.push({
          id: id.substring(id.indexOf("_") + 1),
          count: combos[i].value
        })

        fdstr = fdstr + "  |  " + combos[i].parentNode.parentNode.childNodes[0].id + ":" + combos[i].value
      }
    }
    setFoodDrinks(fds)
    setFdStr(fdstr.substring(10))

    var count = 0
    for (let i = 0; i < ticketNums.length; i++) {
      count = count + ticketNums[i].value * 1;
    }
    setCountTicket(count)
  }

  const nextStep = () => {
    if (step === '1') {
      if (countTicket === 0 ) {
        alert("Vui l??ng ch???n mua ??t nh???t 1 v?? ????? chuy???n sang b?????c ti???p theo")
      }
      else if (countTicket > 10 ) {
        alert("S??? l?????ng t???i ??a cho m???i lo???i v?? l?? 10, vui l??ng ki???m tra v?? nh???p l???i")
      }
      else {
        setTimeout(displayMap, 500);
        setStep('2')
      }
    }
    else if (step === '2') {
      if (seats.length === countTicket) {

        var seatStr = []
        for (var i = 0; i < seats.length; i++) {
          seatStr.push(seats[i].id);
        }
        seatStr = seatStr.concat().toString()

        var bookingTime = moment().format('YYYY-MM-DD h:mm:ss');
        var keepingTime = moment().add(15, 'minutes').format('YYYY-MM-DD h:mm:ss');
        let params = {
          data: {
            bookingTime,
            keepingTime,
            seats: seatStr,
            fee: sum,
            sessionId: detailSession.id,
            sessionRoomId: detailSession.roomId,
            foodDrinks: foodDrinks
          },
          headers: {
            'Authorization': `Bearer ${token.access_token}`
          }
        }
        dispatch(bookTicket(params))

        history.push("book-session")

        setStep('3')
      }
      else {
        alert("Vui l??ng ch???n ????? ch??? ng???i t????ng ???ng v???i s??? v?? ???? ch???n ????? chuy???n sang b?????c ti???p theo!")
      }
    }
  }

  const backStep = () => {
    if (step === '2') {
      undisplayMap()
      setStep('1')
    }
    if (step === '3') {
      undisplayMap()
      setStep('2')
    }
  }

  const displayMap = () => {
    document.getElementById('ticket-food').style.display = 'none'
    document.getElementById('map-section').style.display = 'block'
    document.getElementById('btn-back').style.display = 'initial'
    dispatch(actions.refeshTicket())
  }

  const undisplayMap = () => {
    for (var i = 0; i < seats.length; i++) {
      seats[i].classList.remove("bgGreen")
    }
    document.getElementById('ticket-food').style.display = 'block'
    document.getElementById('map-section').style.display = 'none'
    document.getElementById('btn-back').style.display = 'none'

  }

  return (
    <BookTicketWrapper>
      <div className="content">
        <div className="content-section" id="ticket-food">
          <h1>CH???N V??/ TH???C ??N</h1>
          <table>
            <tr><th>ch???n v??</th><th>S??? l?????ng</th><th className="right">Gi??(VN??)</th><th className="right">T???ng(VN??)</th></tr>
            <tr>
              <td>V?? 2D<br></br></td>
              <td>
                <input type="number" className="ticketNum" defaultValue="0" min="0" max="100" onChange={change}></input>
              </td>
              <td className="right">{detailSession.price}</td>
              <td className="right ticket-price">0</td>
            </tr>
            <tr className="tr-sum"><td colSpan={3}>T???ng</td><td className="right" id="ticketSum">0</td></tr>

            <tr><th>Combo</th><th>S??? l?????ng</th><th className="right">Gi??(VN??)</th><th className="right">T???ng(VN??)</th></tr>

            {categories.map((data, index) => (

              <tr key={`typeCombo-${index}`}>
                <td id={`${data.name}`}>{data.name}</td>
                <td>
                  <input className="fds" id={`fds_${data.id}`} key={`typeCombo-1-${index}`} type="number" name="ticketNum" defaultValue="0" min="0" max="100" onChange={change}></input>
                </td>
                <td className="right">{data.price}</td><td className="right combo-price">0</td>
              </tr>
            ))}

            <tr className="tr-sum"><td colSpan={3}>T???ng</td><td className="right" id="comboSum">0</td></tr>
          </table>
          <div className="sum">
            <label>T???ng</label> <label>{sum}</label> VN??
            <Button onClick={nextStep}>Ti???p t???c</Button>
          </div>
        </div>

        <div className="content-section" id='map-section'>
          <h1> CH???N GH???</h1>
          <div className="map">
            <table>
              {rows.map((data, rindex) => (
                <tr>
                  <td className="cell-left">{String.fromCharCode(rindex + 65)}</td>
                  {cols.map((data, index) => (
                    <td id={`${String.fromCharCode(rindex + 65)}-${index}`} className={`cell${bookedSeats.split(",").indexOf(String.fromCharCode(rindex + 65) + "-" + index) !== -1 ? " bgRed" : ""}`} onClick={changeBg}>{index}</td>
                  ))}
                  <td className='cell-right'>{String.fromCharCode(rindex + 65)}</td>
                </tr>
              ))}
            </table>
            <h3>M??n h??nh</h3>
            <div className="screen"></div>
            <div className="div-note">
              <span className="note chosing"></span>Gh??? ??ang ch???n
              <span className="note sold"></span>Gh??? ???? b??n
              <span className="note enable"></span>Gh??? c?? th??? ch???n
            </div>
          </div>
        </div>

        <div className="event-section">
          <div className="content-event">
            <div className="div-img">
              <img src={film.poster} alt=""></img>
              <h1>{film.name}</h1>
              <h1 className="sub-title">{film.subName}</h1>
              <Divider></Divider>
              <p><b>R???p:</b>{detailSession?.Room?.name}</p>
              <Divider></Divider>
              <p><b>Su???t chi???u:</b>{detailSession?.startTime}</p>
              <Divider></Divider>
              <p><b>Th???i l?????ng:</b>{`${film?.duration} ph??t`}</p>
              <Divider></Divider>
              <p><b>Combo: </b><span>{fdStr}</span></p>
              <Divider></Divider>
              <p><b>Gh???: </b><span></span></p>
              <Divider></Divider>
              <p><b>T???ng: </b><span className="color-orange"> {sum} VND</span></p>

              <Button onClick={backStep} className='btn-back' id='btn-back'> Quay l???i</Button>
              <Button onClick={nextStep}>Ti???p t???c</Button>
            </div>
          </div>
        </div>
      </div>
    </BookTicketWrapper>
  );
};

export default BookTicket;
