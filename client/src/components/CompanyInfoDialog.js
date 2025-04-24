import React, { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, CircularProgress, Box, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CloseIcon from "@mui/icons-material/Close"
import { fetchCompanyInfoById, updateCompanyInfo, createCompanyInfo } from "../api/company_infoApi"

export default function CompanyInfoDialog({ companyId, open, onClose, canEdit=true}) {
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ name: "", description: "" })
  const [saving, setSaving] = useState(false)
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchCompanyInfoById(companyId)
        .then(info => {
          setInfo(info);
          setEditMode(false);
        })
        .catch(error => {
          console.error("Error fetching company info:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, companyId]);

  const handleEdit = () => setEditMode(true)
  const handleCancelEdit = () => {
    setEditMode(false)
    setEditData({ name: info?.name || "", description: info?.description || "" })
  }
  const handleChange = e => setEditData({ ...editData, [e.target.name]: e.target.value })
  const handleSave = async () => {
    setSaving(true)
    if (info === null) {
      await createCompanyInfo({ companyId, ...editData });
    } else {
      await updateCompanyInfo(companyId, editData)
    }
    setEditMode(false)
    setSaving(false)
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Информация о компании
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Box>
            {editMode ? (
              <>
                <TextField label="Название" name="name" value={editData.name} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Описание" name="description" value={editData.description} onChange={handleChange} fullWidth margin="normal" multiline minRows={3} />
              </>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom>Название: {info?.name || "Не определено"}</Typography>
                <Typography variant="body2" gutterBottom>Описание: {info?.description || "Не определено"}</Typography>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={handleCancelEdit}>Отмена</Button>
            <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />} disabled={saving}>{saving ? <CircularProgress size={20} /> : "Сохранить"}</Button>
          </>
        ) : (
          canEdit && <Button onClick={handleEdit} startIcon={<EditIcon />} disabled={loading || saving}>Редактировать</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
