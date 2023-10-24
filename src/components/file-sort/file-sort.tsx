import * as React from 'react'
import { GrafContext } from '@/graf/context/GraftContext'
import { useData } from '@/graf/hooks/useData'
import { ProcessFile } from '@/graf/interfaces/interfaces'
import { GroupIcon, UngroupIcon } from 'lucide-react'
import { useSnackbar } from 'notistack'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { Button } from '../ui/button'
import Container from './container'
import Item from './item'
import List from './list'
import RemoveSelection from './remove-selection'

type GroupedFiles = {
  teq4: ProcessFile[]
  teq4Z: ProcessFile[]
  csv: ProcessFile[]
  all: ProcessFile[]
}

type FileSortProps = {
  maxHeight?: string
}

const FileSort = (props: FileSortProps) => {
  const {
    graftState: { isFilesGrouped, files },
    setIsFilesGrouped,
  } = React.useContext(GrafContext)
  const { maxHeight } = props

  const { changeSelectedFile } = useData()
  const { enqueueSnackbar } = useSnackbar()

  const [groupedFiles, setGroupedFiles] = React.useState<GroupedFiles>({
    teq4: [],
    teq4Z: [],
    csv: [],
    all: files,
  })

  const groupFiles = React.useCallback(() => {
    if (isFilesGrouped) {
      setGroupedFiles({
        teq4: [],
        teq4Z: [],
        csv: [],
        all: files,
      })
    } else {
      setGroupedFiles({
        teq4: files.filter((f) => f.type === 'teq4'),
        teq4Z: files.filter((f) => f.type === 'teq4Z'),
        csv: files.filter((f) => f.type === 'csv'),
        all: [],
      })
    }
  }, [groupedFiles])

  const handleChangeGroupedFiles = React.useCallback(() => {
    setIsFilesGrouped(!isFilesGrouped)
    groupFiles()
  }, [isFilesGrouped])

  const handleFileSelectedChange = React.useCallback(
    (id: string) => {
      try {
        changeSelectedFile(id)
      } catch (e) {
        enqueueSnackbar(`You can't select more than 10 files`, {
          variant: 'warning',
        })
      }
    },
    [files]
  )

  return (
    <Container maxHeight={maxHeight} className='relative bg-secondary'>
      <div className='sticky top-0 z-50 flex w-full justify-center gap-4 bg-secondary'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleChangeGroupedFiles()}
        >
          {isFilesGrouped ? (
            <UngroupIcon className='h-[15px] w-[15px]' />
          ) : (
            <GroupIcon className='h-[15px] w-[15px]' />
          )}
        </Button>
        <RemoveSelection />
      </div>
      {isFilesGrouped ? (
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='teq4'>
            <AccordionTrigger>TEQ4</AccordionTrigger>
            <AccordionContent>
              <List>
                {groupedFiles.teq4.map((file) => (
                  <Item
                    key={file.id}
                    file={file}
                    setFile={handleFileSelectedChange}
                  />
                ))}
              </List>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='teq4z'>
            <AccordionTrigger>TEQ4Z</AccordionTrigger>
            <AccordionContent>
              <ul className='flex flex-col space-y-3 text-center sm:text-left'>
                {groupedFiles.teq4Z.map((file) => (
                  <Item
                    key={file.id}
                    file={file}
                    setFile={handleFileSelectedChange}
                  />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='CSV'>
            <AccordionTrigger>CSV</AccordionTrigger>
            <AccordionContent>
              <ul className='flex flex-col space-y-3 text-center sm:text-left'>
                {groupedFiles.csv.map((file) => (
                  <Item
                    key={file.id}
                    file={file}
                    setFile={handleFileSelectedChange}
                  />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <List>
          {files.map((file) => (
            <Item
              key={file.id}
              file={file}
              setFile={handleFileSelectedChange}
            />
          ))}
        </List>
      )}
    </Container>
  )
}

export default FileSort
