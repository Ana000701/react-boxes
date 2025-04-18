import { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

import { useDeleteBox, useUpdateBox } from "@/hooks/boxes/useBoxes";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

DeleteBoxDialog.propTypes = { row: PropTypes.object, icons: PropTypes.object };

function DeleteBoxDialog({ row, icons }) {
  const { updateBox } = useUpdateBox();
  const { deleteBox } = useDeleteBox();
  const [open, setOpen] = useState(false);
  const result = ["自用", "可認領"].includes(row.status) ? "回收" : "刪除";

  const handleUpdate = () => {
    if (result === "刪除") {
      deleteBox(
        { boxId: row.id },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
      return;
    }
    const formattedValues = {
      status: "報廢",
      retention_days: Number(row.retention_days),
    };
    updateBox(
      { boxId: row.id, values: formattedValues },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className={`rounded-md ${result === "回收" ? "bg-green-600" : "bg-red-600"} p-2 text-white ${result === "回收" ? "hover:bg-green-500" : "hover:bg-red-500"} focus-visible:outline-none`}
          >
            {icons}
          </button>
        </DialogTrigger>

        <DialogContent inert={!open}>
          <DialogHeader>
            <DialogTitle>
              {result}
              紙箱
            </DialogTitle>
            <DialogDescription>
              確定要 {result} 紙箱編號：{row.id} 的紙箱嗎?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <button
              className="btn-cancel"
              onClick={() => {
                setOpen(false);
                toast.error(`取消${result}`);
              }}
            >
              取消
            </button>
            <button
              className={`${result === "回收" ? "btn-recycle" : "btn-delete"}`}
              onClick={handleUpdate}
            >
              {result}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteBoxDialog;
