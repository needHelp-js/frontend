import Tablero from '../components/Tablero';
import { configure, shallow, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import React from "react";
import "jest-canvas-mock";

configure({ adapter: new Adapter() });

describe("Tablero", () => {
  it("1. Renderizar el tablero.", () => {
    const component = shallow(<Tablero />);
    expect(component.getElements()).toMatchSnapshot();
  });
  
  it(" 2.El tablero debería 640x640 de resolución.", () => {
    const component = shallow(<Tablero />);
    expect(component.find("canvas").props().style.width).toEqual(640);
    expect(component.find("canvas").props().style.height).toEqual(640);
  });

});

