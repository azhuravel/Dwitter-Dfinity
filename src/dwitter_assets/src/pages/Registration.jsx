import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/index.js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';


const Registration = () => {
    const {handleSubmit, setError, control} = useForm();
    const {ctx, setCtx} = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    
    const onSubmit = async (data) => {
        setSubmitting(true);

        const username = data.username;
        const displayname = data.displayname;

        if (username !== ctx?.currentUser?.username) {
            const usernameResponse = await ctx.dwitterActor.getByUsername(username);
            const usernameAvailable = !(usernameResponse[0]);
            if (!usernameAvailable) {
                setError('username', {type: 'server', message: 'Already in use'});
                setSubmitting(false);
                return;
            }
        }

        await ctx.dwitterActor.saveUser({username, displayname});
        const userResponse = await ctx.dwitterActor.getCurrentUser();
        const user = userResponse[0];
        setCtx({...ctx, currentUser: user});

        setSubmitting(false);
    }

    return (
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Grid container component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                    <Controller
                        name="username"
                        control={control}
                        defaultValue={ctx.currentUser.username} 
                        render={({field: {onChange, value}, fieldState: {error}}) => (
                        <TextField
                            label="Username"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            disabled={submitting}
                            autoFocus
                        />
                        )}
                        rules={{
                            required: 'this is a required',
                            minLength: {value: 4, message: 'Min length is 4'},
                            maxLength: {value: 15, message: 'Max length is 15'},
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="displayname"
                        control={control}
                        defaultValue={ctx.currentUser.displayname} 
                        render={({field: {onChange, value}, fieldState: {error}}) => (
                        <TextField
                            label="Display name"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            disabled={submitting}
                        />
                        )}
                        rules={{
                            required: 'this is a required',
                            minLength: {value: 4, message: 'Min length is 4'},
                            maxLength: {value: 15, message: 'Max length is 15'},
                        }}
                    />
                </Grid>
                    
                <Grid item xs={12}>
                    <LoadingButton type="submit" variant="contained" loading={submitting}>Save</LoadingButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Registration;



// import React, { useState, useContext, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Grid from '@mui/material/Grid';
// import { AuthContext } from '../context/index.js';
// import { useNavigate } from "react-router-dom";


// const Registration = () => {
//     const navigate = useNavigate();

//     const {ctx, setCtx} = useContext(AuthContext);

//     const [usernameError, setUsernameError] = useState("");
//     const [username, setUsername] = useState("");

//     const [displaynameError, setDisplaynameError] = useState("");
//     const [displayname, setDisplayname] = useState("");

//     const [saveDisabled, setSaveDisabled] = useState(true);

//     const validateUsername = async () => {
//         let error = "";
//         if (!username) {
//             error = "Required";
//         } else if (username.length < 4 || username.length > 15) {
//             error = "Length should be between 4 and 15 symbols";
//         } else {
//             const usernameResponse = await ctx.dwitterActor.getByUsername(username);
//             const available = !(usernameResponse[0]);
//             if (!available) {
//                 error = "Already existing";
//             }
//         }
//         // add alphanumeric check
//         return error;
//     }

//     const validateDisplayname = () => {
//         let error = "";
//         if (!displayname) {
//             error = "Required";
//         } else if (displayname.length < 4 || displayname.length > 15) {
//             error = "Length should be between 4 and 15 symbols";
//         }
//         return error;
//     }

//     useEffect(() => {
//         let active = true;

//         const validateAvailable = async () => {
//             let displaynameError = validateDisplayname();
//             let usernameError = await validateUsername();
//             if (active) {
//                 if (!username && !displayname) { // TODO fix the quick hack for empty form
//                     setDisplaynameError("");
//                     setUsernameError("");
//                     setSaveDisabled(true);
//                 } else {
//                     setDisplaynameError(displaynameError);
//                     setUsernameError(usernameError);
//                     setSaveDisabled(!!displaynameError || !!usernameError);
//                 }
//             }
//         };

//         validateAvailable();
        
//         return () => {
//             active = false;
//         };
//     }, [username, displayname])

//     const handleUsernameChange = (e) => {
//         setSaveDisabled(true);
//         setUsername(e.target.value);
//     }

//     const handleDisplaynameChange = (e) => {
//         setSaveDisabled(true);
//         setDisplayname(e.target.value);
//     }

//     const saveUser = () => {
//         setSaveDisabled(true);
//         let _save = async () => {
//             await ctx.dwitterActor.saveUser({username, displayname});

//             // TODO: or redirect to LoginPage or optimized (saveUser can return User object)
//             const userResponse = await ctx.dwitterActor.getCurrentUser();
//             const user = userResponse[0];
//             setCtx({...ctx, currentUser: user});
//             // navigate(`/user/${user.username}`, { replace: true }); 
//         }
//         _save();
//     }

//     return (
//         <Grid container justifyContent="center">
//             <Grid container justifyContent="center" direction="column">
//                 <TextField id="standard-basic" 
//                     label="Username" 
//                     variant="standard" 
//                     helperText={usernameError}  
//                     value={username}
//                     onChange={handleUsernameChange}
//                     error={!!usernameError}
//                 />
//                 <TextField id="standard-basic" 
//                     label="Display name" 
//                     variant="standard"
//                     helperText={displaynameError} 
//                     value={displayname}
//                     onChange={handleDisplaynameChange}
//                     error={!!displaynameError}
//                 />
//                 <Button variant="contained" disabled={saveDisabled} onClick={saveUser}>Save</Button>
//             </Grid>
//         </Grid>
//     );
// };

// export default Registration;
