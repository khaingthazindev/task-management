import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks({
    items,
    label,
    name,
    selectHandler,
}) {
    const [selected, setSelected] = React.useState([]);
    const handleChange = (event) => {
        setSelected(event.target.value);
        selectHandler(event);
    };

    return (
        <div>
            <FormControl sx={{ ml: 1, width: 150 }} size="small">
                <InputLabel id="demo-multiple-checkbox-label">
                    {label}
                </InputLabel>
                <Select
                    name={name}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    input={<OutlinedInput label="Status" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {items.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={selected.includes(name)} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
