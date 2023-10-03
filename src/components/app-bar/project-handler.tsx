import * as React from 'react'
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons'
import { useSnackbar } from 'notistack'

import { GrafContext } from '../../graf/context/GraftContext'
import { LoadingsContext } from '../../graf/context/Loading'
import { openProject, saveProject } from '../../graf/utils'
import CustomTooltip from '../ui/tooltip'

const ProjectHandler = () => {
  const { graftState, setGraftState } = React.useContext(GrafContext)
  const { setLoading } = React.useContext(LoadingsContext)
  const { enqueueSnackbar } = useSnackbar()

  const open = async () => {
    setLoading(true)
    const dat = await openProject()
    dat?.data && setGraftState(dat?.data)
    enqueueSnackbar(dat.notification.message, {
      variant: dat.notification.variant,
    })
    setLoading(false)
  }

  const save = async () => {
    setLoading(true)
    const notification = await saveProject(graftState)
    enqueueSnackbar(notification.message, { variant: notification.variant })
    setLoading(false)
  }

  return (
    <div className='ml-3 flex gap-3'>
      <CustomTooltip
        title='Open Project'
        onClick={open}
        Icon={<UploadIcon />}
      />
      <CustomTooltip
        title='Save Project'
        Icon={<DownloadIcon />}
        onClick={save}
      />
    </div>
  )
}

export default ProjectHandler
