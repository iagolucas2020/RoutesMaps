import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { AlertBasic } from "../Alert/index.js";
import "./Modal.css";
import { getTimeDelivery } from "../../functionsUseful/getTimeDelivery.js";
import { GetMaps } from "../../services/queryMaps.js";
import { calculeTimeDelivery } from "../../functionsUseful/calculeTimeDelivery.js";

function Add(props) {
  const [data, setData] = useState({
    name: "",
    description: "",
    origin: "",
    destination: "",
  });

  const [lastId, setLastId] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const addOrder = async () => {
    if (!checkedOriginAndDestination()) return;
    const response = await GetMaps(data.origin, data.destination);
    let time = 0;
    if (response.status === 200) {
      time = response.data.routes[0].legs[0].duration.value;
    } else {
      AlertBasic(
        "Atenção",
        "Por favor, verifique o endereço da rota esta correto, não foi possível localizar.",
        "error"
      );
      return;
    }
    const obj = await buildObj(time);
    if (!checkInput(obj)) return;
    props.funcUpdate(obj);
    clear();
  };

  const clear = () => {
    setData({
      name: "",
      description: "",
      origin: "",
      destination: "",
    });
  };

  const checkInput = (obj) => {
    for (var prop in obj) {
      if (obj[prop] === "") {
        AlertBasic(
          "Atenção",
          "Preencher todos os campos para adicionar pedido.",
          "error"
        );
        return false;
      }
    }
    return true;
  };

  const buildObj = (time) => {
    debugger;
    const { requestOrder, deliveryOrder } = getTimeDelivery(time);
    const id = lastId > 0 ? lastId + 1 : 1;
    setLastId(id);
    return {
      id: id,
      name: data.name,
      description: data.description,
      origin: data.origin,
      destination: data.destination,
      requestOrder: requestOrder,
      deliveryOrder: deliveryOrder,
      deliveryTime: calculeTimeDelivery(deliveryOrder),
      status: "Em Andamento",
    };
  };

  const checkedOriginAndDestination = () => {
    if (data.origin === "" || data.destination === "") {
      AlertBasic(
        "Atenção",
        "Por favor, preencher origem e destino de entrega.",
        "error"
      );
      return false;
    }
    return true;
  };

  return (
    <Modal isOpen={props.visible}>
      <ModalHeader className="modalHeader"> Incluir Pedido </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <div className="row">
            <div class="form-group col-sm-12">
              <label>Nome:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={handleChange}
              />
            </div>
            <div class="form-group col-sm-12">
              <label>Descrição (lanche):</label>
              <select
                className="form-control"
                name="description"
                onChange={handleChange}
              >
                <option value={""}>selecione...</option>
                <option value={"Hamburger"}>Hamburger</option>
                <option value={"Hamburger Duplo"}>Hamburger Duplo</option>
                <option value={"Hamburger Acebolado"}>
                  Hamburger Acebolado
                </option>
                <option value={"Hamburger com Batata"}>
                  Hamburger com Batata
                </option>
              </select>
            </div>
            <div class="form-group col-sm-12">
              <label>End. Origem:</label>
              <input
                type="text"
                className="form-control"
                name="origin"
                onChange={handleChange}
              />
            </div>
            <div class="form-group col-sm-12">
              <label>End. Destino:</label>
              <input
                type="text"
                className="form-control"
                name="destination"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="modalFooter">
        <button
          disabled={!data.name}
          className="btn btn-primary"
          onClick={() => {
            addOrder();
          }}
        >
          Incluir
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            props.func();
          }}
        >
          Cancelar
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default Add;
