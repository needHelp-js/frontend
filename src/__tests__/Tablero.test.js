import Tablero from '../components/Tablero';
import { configure, shallow, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import React from "react";
import "jest-canvas-mock";

configure({ adapter: new Adapter() });

describe("Tablero", () => {
  it("should render my component", () => {
    const component = shallow(<Tablero />);
    expect(component.getElements()).toMatchSnapshot();
  });

});

