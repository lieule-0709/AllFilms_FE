import React, { useState } from 'react'
import logo from './logo.png';
import './css/App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import PrivateRoute from './routers/PrivateRoute'
import Home from './routers/Home';
import Details from './routers/Details';
import InfoUser from './routers/InfoUserPage';
import Actor from './routers/Actor';
import Diretor from './routers/Director';
import BookTicket from './routers/BookTicket';
import BookSS from './routers/BookSS';
import SelectTicket from './routers/SelectTicket';
import SelectFilm from './routers/SelectTicket';
import Promotion from './routers/Promotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import {
  Modal, Form, Input, Button, Checkbox, Tabs
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import { login, register } from './redux/token/actions';
import { actions } from './redux/token/slice';
import {searchFilm} from './redux/data/actions';
import {actions as dataActions}  from './redux/data/slice' ;

import SearchFilm from './components/listSearch';
import ScrollToTop from './ScrollToTop';

function App() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.token.token);
  const username = useSelector(state => state.token.username);
  const listSearch = useSelector(state => state.data.listSearch);

  const [isModalVisible, setIsModalVisible] = useState(false);  
  const [formLogin] = Form.useForm();
  const [formRegister] = Form.useForm();
  const { TabPane } = Tabs;
  const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

  const showCfModal = () => {
    setIsModalConfirmVisible(true);
  };

  const handleCfOk = () => {
    dispatch(actions.logout({}));
    setIsModalConfirmVisible(false);
  };

  const handleCfCancel = () => {
    setIsModalConfirmVisible(false);
  };

  const goToFilms = () => {
    let films = document.getElementById("#phim");

    if (films) {
      films.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    document.getElementById("logo-allfilms").click();

    setTimeout(() => {
      films = document.getElementById("#phim");
      films.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const goToPromotions = () => {
    let promotions = document.getElementById("#promotion");

    if (promotions) {
      promotions.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    document.getElementById("logo-allfilms").click();

    setTimeout(() => {
      promotions = document.getElementById("#promotion");
      promotions.scrollIntoView({ behavior: 'smooth' });
    });
  } 

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  function callback(key) {
    console.log(key);
  }

  const loginCheck = async () => {
    try {
      await formLogin.validateFields();
      loginClick();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const loginClick = () => {

    const name = document.getElementById("normal_login").username.value;
    const pass = document.getElementById("normal_login").password.value;

    dispatch(login({
      username: name,
      password: pass
    }));

    closeModal();
  }

  const registerCheck = async () => {
    try {
      await formRegister.validateFields();
      registerClick();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const registerClick = () => {

    const username = document.getElementById("register").username.value;
    const password = document.getElementById("register").password.value;
    const fullname = document.getElementById("register").fullname.value;
    const email = document.getElementById("register").email.value;
    const phone = document.getElementById("register").phone.value;

    dispatch(register({
      username: username,
      password: password,
      name: "test",
      fullname: fullname,
      email: email,
      phone: phone
    }));

    closeModal();
  }

  function search(value){
    if(value === ""){
      dispatch(dataActions.clearSearchList())
    }
    else dispatch(searchFilm(value))
  }

  return (
    <div className="App">
      <Router>
      <ScrollToTop>
         <div className="header">
          <div className="head_content flex">
            <Link to="/" id="logo-allfilms"><img className="logo" src={logo} alt="logo"></img></Link>
            <div className="div_input">
              <input className="input" placeholder="T??m t??n phim, di???n vi??n" onChange={event => search(event.target.value)}></input>
              <SearchFilm style={{ display: (listSearch.length===0 ? 'none' : 'initial') }}/>
              <FontAwesomeIcon icon={faSearch} color="gray" className="icon_abs search" />
            </div>

            <div className="login" style={{ display: (token.access_token ? 'none' : 'initial') }}>
              <label type="primary" onClick={showModal}>
                <FontAwesomeIcon icon={faUser} className="icon_abs icon-user" />
                ????ng nh???p
              </label>
              <Modal footer={null} visible={isModalVisible} onOk={handleOk} onCancel={closeModal}>
                <Tabs defaultActiveKey="1" onChange={callback}>
                  <TabPane tab="????ng nh???p" key="1">
                    <Form
                      form={formLogin}
                      name="normal_login"
                      className="login-form"
                      initialValues={{ remember: true }}
                    >
                      <Form.Item
                        name="username"
                        rules={[{ 
                          required: true, 
                          message: 'Vui l??ng nh???p t??n t??i kho???n c???a b???n.',
                          whitespace: true, }]}
                      >
                        <Input name="username" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nh???p t??n ng?????i d??ng." />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        tooltip="8 ?????n 64 k?? t???, c?? th??? ch???a ch??? hoa, ch??? th?????ng v?? s???"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p m???t kh???u c???a b???n.',
                          },
                        ]}
                      >
                        <Input
                          name="password"
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          type="password"
                          placeholder="Nh???p m???t kh???u c???a b???n."
                        />
                      </Form.Item>

                      <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          <Checkbox name="remember" >Ghi nh??? t??i kho???n n??y</Checkbox>
                        </Form.Item>
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" className="login-form-button"
                          onClick={loginCheck}>
                          ????ng nh???p
                        </Button>
                      </Form.Item>
                    </Form>
                  </TabPane>
                  <TabPane tab="????ng k??" key="2">
                    <Form
                      form={formRegister}
                      name="register"
                      scrollToFirstError
                    >

                      <Form.Item
                        name="username"
                        label="T??n t??i kho???n"
                        tooltip="1 ?????n 64 k?? t???, c?? th??? ch???a k?? t??? ch???, s???, - v?? _"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p t??n t??i kho???n c???a b???n.',
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input name="username" />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        label="M???t kh???u"
                        tooltip="8 ?????n 64 k?? t???, c?? th??? ch???a ch??? hoa, ch??? th?????ng v?? s???"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p m???t kh???u c???a b???n.',
                          },
                        ]}                        
                      >
                        <Input.Password name="password" />
                      </Form.Item>

                      <Form.Item
                        name="confirm"
                        label="X??c nh???n l???i m???t kh???u"                        
                        tooltip="Nh???p l???i m???t kh???u m???t l???n n???a ????? x??c nh???n."
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng x??c nh???n l???i m???t kh???u.',
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('X??c nh???n m???t kh???u ch??a ch??nh x??c, vui l??ng nh???p l???i!'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>

                      
                      <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                          {
                            type: 'email',
                            message: 'Email kh??ng h???p l???!',
                          },
                          {
                            required: true,
                            message: 'Vui l??ng nh???p E-mail c???a b???n.',
                          },
                        ]}
                      >
                        <Input name="email" />
                      </Form.Item>

                      <Form.Item
                        name="fullname"
                        label="H??? t??n"                        
                        tooltip="Nh???p h??? t??n c???a b???n (t??? 1 ?????n 255 k?? t???)."
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p h??? t??n ?????y ????? c???a b???n.',
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input name="fullname" />
                      </Form.Item>

                      <Form.Item
                        name="phone"
                        label="S??? ??i???n tho???i"                        
                        tooltip="Bao g???m 10 k?? t??? s???."
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p s??? ??i???n tho???i c???a b???n.',
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input name="phone"
                          style={{
                            width: '100%',
                          }}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" onClick={registerCheck}>
                          ????ng k??
                        </Button>
                      </Form.Item>
                    </Form>
                  </TabPane>
                </Tabs>
              </Modal>
            </div>
            <div className='logout' style={{ display: (token.access_token ? 'initial' : 'none') }}>
              <p>
                <FontAwesomeIcon icon={faUser} className="icon_abs icon-user" /> {`${username}`}
              </p>
              <ul className='user'>
                <Link to="/member"><li>Th??ng tin</li></Link>
                <li onClick={showCfModal}>????ng xu???t</li>
              </ul>

              <Modal title="Confirm logout" visible={isModalConfirmVisible} onOk={handleCfOk} onCancel={handleCfCancel}>
                <p>B???n c?? ch???c ch???n mu???n ????ng xu???t kh???i h??? th???ng?</p>
              </Modal>

            </div>
          </div>

          <div className="black">
            <div className="menu">
              <ul className="flex">
                <Link to="/">HOME</Link>|<Link to="/select-ticket">MUA V??</Link>|<p className="menu_tab" onClick={goToFilms} >PHIM</p>|<p className="menu_tab" onClick={goToPromotions}>KHUY???N M??I</p>|<Link to="/member">TH??NH VI??N</Link>
              </ul>
            </div>
          </div>
        </div>

        <Switch>
          <Route path="/details/:id" component={Details}></Route>
          <Route path="/actor/:id" component={Actor}></Route>
          <Route path="/director/:id" component={Diretor}></Route>
          <Route path="/book-ticket/book-session" exact component={BookSS}></Route>
          <PrivateRoute path="/book-ticket/:id" exact component={BookTicket}></PrivateRoute>
          <Route path="/select-ticket" component={SelectTicket}></Route>
          <Route path="/test" component={SelectFilm}></Route>
          <PrivateRoute path="/member" exact component={InfoUser}></PrivateRoute>
          <PrivateRoute path="/promotion/:id" exact component={Promotion}></PrivateRoute>
          <Route
            path="/" exact
            component={Home} />
        </Switch>
        </ScrollToTop>
      </Router>
      <footer>
        <p>C??ng Ty C??? Ph???n ALLFILMS, ?????i h???c B??ch khoa- ?????i h???c ???? N???ng, 54, Nguy???n L????ng B???ng, H??a Kh??nh B???c, Li??n Chi???u, ???? N???ng</p>
      </footer>
    </div>
  );
}

export default App;
