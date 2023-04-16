import { styled } from "@mui/material/styles";
import { AutocompleteGetTagProps, autocompleteClasses } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

export const Root = styled("div")(
  ({ theme }) => `
    color: rgba(0,0,0,.85)
    font-size: 14px;
  `
);

export const InputWrapper = styled("div")(
  ({ theme }) => `
    margin-bottom: 16px;
    width: 100%;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 4px;
    padding: 1px;
    display: flex;
    flex-wrap: wrap;
    height:56px;
  
    &:hover {
      border-color: #40a9ff;
    }
  
    &.focused {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  
    & input {
      background-color: #fff;
      color: rgba(0,0,0,.85)
      height: 3px;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 0;
      min-width: 30px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `
);

export const Listbox = styled("ul")(
  ({ theme }) => `
    width: 400px;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: #fff;
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  
    & li {
      padding: 5px 12px;
      display: flex;
  
      & span {
        flex-grow: 1;
        font-size:14px;
      }
  
      & svg {
        color: transparent;
      }
    }
  
    & li[aria-selected='true'] {
      background-color: #fafafa;
      font-weight: 600;
  
      & svg {
        color: #1890ff;
      }
    }
  
    & li.${autocompleteClasses.focused} {
      background-color: #e6f7ff;
      cursor: pointer;
  
      & svg {
        color: currentColor;
      }
    }
  `
);

export const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
    display: flex;
    align-items: center;
    height: 30px;
    margin: 2px;
    line-height: 26px;
    background-color: #e6f7ff;
    border: 1px solid #40a9ff;
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;
    font-size:14px;
  
    &:focus {
      border-color: #40a9ff;
      background-color: #e6f7ff;
    }
  
    & span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  
    & svg {
      font-size: 12px;
      cursor: pointer;
      padding: 4px;
    }
  `
);
