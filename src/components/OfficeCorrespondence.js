import React , {useState} from "react";
import { Box,Typography,TextareaAutosize } from "@mui/material";

function OfficeCorrespondence(){
    const [officeAddress, setOfficeAddress] = useState('');
    return(
        <Box className="form-section">
            <Typography className="label">Office Address of Correspondence (Use ‘ , ’ for separation)</Typography>
            <TextareaAutosize
              minRows={3}
              placeholder="Enter office address, separated by commas"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="textarea"
            />
          </Box>
    )
}
export default OfficeCorrespondence;