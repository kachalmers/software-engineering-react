/**
 * @jest-environment jsdom
 */
import {Tuit} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";
import '@testing-library/jest-dom'
import Tuits from "../components/tuits/index";

const MOCKED_USERS = [
  {username: 'alice_wonderland', password: 'teaparty', email: 'alice@wonderland.com', _id: "123"},
  {username: 'bob_ross', password: 'happylittletrees', email: 'bob@ross.com', _id: "234"},
  {username: 'charlie_chaplin', password: 'blackwhite', email: 'charlie@chaplin.com', _id: "345"}
];

const MOCKED_TUITS = [
  {
    "_id": "001",
    "tuit": "alice's tuit",
    "postedBy": {
      "_id": "123",
      "username": "alice_wonderland",
      "password": "teaparty",
      "email": "alice@wonderland.com",
      "salary": 50000,
      "__v": 0
    },
    "postedOn": "2022-03-07T21:35:08.575Z",
    "__v": 0
  },
  {
    "_id": "002",
    "tuit": "bob's tuit",
    "postedBy": {
      "_id": "234",
      "username": "bob_ross",
      "password": "happylittletrees",
      "email": "bob@ross.com",
      "salary": 50000,
      "__v": 0
    },
    "postedOn": "2022-03-07T21:35:08.575Z",
    "__v": 0
  },
  {
    "_id": "003",
    "tuit": "charlie's tuit",
    "postedBy": {
      "_id": "345",
      "username": "charlie_chaplin",
      "password": "blackwhite",
      "email": "charlie@chaplin.com",
      "salary": 50000,
      "__v": 0
    },
    "postedOn": "2022-03-07T21:35:08.575Z",
    "__v": 0
  }
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>);
  const tuit = screen.getByText(/alice's tuit/i);
  expect(tuit).toBeInTheDocument();
});

test('tuit list renders async', async () => {
  const tuits = await findAllTuits();
  render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);
  const tuit = screen.getByText(/Hi, I'm bob/i);
  expect(tuit).toBeInTheDocument();})

test('tuit list renders mocked', async () => {
  const mock = jest.spyOn(axios, 'get');
  mock.mockImplementation(() =>
    Promise.resolve({data: {tuits: MOCKED_TUITS}}));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);

  const tuit = screen.getByText(/charlie's tuit/i);
  expect(tuit).toBeInTheDocument();
  mock.mockRestore();
});
