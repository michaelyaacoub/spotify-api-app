import styled, {keyframes} from "styled-components/macro";
const dance = keyframes`
from {
    height: 10px;
}
to {
    height: 100%;
}
`;

const StyledLoader = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
min-height: 50vh;

.bars {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    overflow: hidden;
    width: 100px;
    min-height: 100px;
    height: 50px;
    margin: 0 auto;
    z-index: 2;
    position: relative;
    left: 0;
    right: 0;
}
`;