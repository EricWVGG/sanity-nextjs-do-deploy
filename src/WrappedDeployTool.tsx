import type {DeployToolOptions} from './types'
import {DeployTool} from './DeployTool'
import styled from 'styled-components'

export const WrappedDeployTool = (options: DeployToolOptions) => (props: any) => (
  <ToolWrapper>
    {props.renderDefault(props)}
    <Rule />
    <DeployTool options={options} />
  </ToolWrapper>
)

const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media only screen and (min-width: 900px) {
    flex-direction: row;
  }
`

const Rule = styled.hr`
  outline: 0;
  border: 0;
  width: 100%;
  height: 1px;
  margin-bottom: 1em;
  background: rgb(226, 227, 231);
  @media (prefers-color-scheme: dark) {
    background: rgb(43, 45, 62);
  }
  @media only screen and (min-width: 900px) {
    display: none;
  }
`
