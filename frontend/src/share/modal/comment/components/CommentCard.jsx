import { Button, Card, TextField, Typography } from '@mui/material';
import React, { useCallback, useState, useContext } from 'react';
import GlobalContext from '../../../Context/GlobalContext';
import Cookies from 'js-cookie';
import Axios from '../../../AxiosInstance';
import { AxiosError } from 'axios';

const CommentCard = ({ comments, setComments, comment = { id: -1, text: '' } }) => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [functionMode, setFunctionMode] = useState('update');
  const [msg, setMsg] = useState(comment.text);

  const { setStatus } = useContext(GlobalContext);

  const submit = useCallback(async () => {
    if (functionMode === 'update') {
      // TODO implement update logic
      try{
        const userToken = Cookies.get('UserToken');
        const response = await Axios.patch(
          '/comment', 
          {
            text: msg,
            commentId: comment.id,
          }, 
          {
            headers: { Authorization: `Bearer ${userToken}`}
          });
        if(response.data.success){
          setStatus({ severity: 'success', msg: 'Update comment successfully' });
          setMsg(response.data.data.text);
          cancelAction();
        }
      } catch(error){
        if (error instanceof AxiosError && error.response){
          setStatus({ severity: 'error', msg: error.response.data.error });
        } else {
          setStatus({ severity: 'error', msg: error.message });
        }
      }
      console.log('update');
    } else if (functionMode === 'delete') {
      // TODO implement delete logic
      try{
        const userToken = Cookies.get('UserToken');
        const response = await Axios.delete('/comment', {
          data: { commentId: comment.id },
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if(response.data.success){
          setStatus({ severity: 'success', msg: 'Successfully deleted comment'});
          console.log(comments);
          setComments(comments.filter((c) => c.id !== comment.id));
        }
      } catch(error) {
        if(error instanceof AxiosError && error.response) {
          setStatus({ severity: 'error', msg: error.response.data.error});
        } else {
          setStatus({ severity: 'error', msg: error.message });
        }
      } 
      console.log('delete');
    } else {
      // TODO setStatus (snackbar) to error
      console.log('error');
    }
  }, [functionMode,msg]);

  const changeMode = (mode) => {
    setFunctionMode(mode);
    setIsConfirm(true);
  };

  const cancelAction = () => {
    setFunctionMode('');
    setIsConfirm(false);
  };

  return (
    <Card sx={{ p: '1rem', m: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {!(isConfirm && functionMode == 'update') ? (
        <Typography sx={{ flex: 1 }}>{msg}</Typography>
      ) : (
        <TextField sx={{ flex: 1 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('update')} variant="outlined" color="info">
          update
        </Button>
      ) : (
        <Button onClick={submit} variant="outlined" color="success">
          confirm
        </Button>
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('delete')} variant="outlined" color="error">
          delete
        </Button>
      ) : (
        <Button onClick={cancelAction} variant="outlined" color="error">
          cancel
        </Button>
      )}
    </Card>
  );
};

export default CommentCard;
