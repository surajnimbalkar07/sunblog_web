import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const [loading, setLoading] = useState(false);
  const { register, watch, setValue, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    }
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    setLoading(true);
    try {
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredimage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredimage: file ? file.$id : undefined,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        // If the file was successfully uploaded
        if (file) {
          // Get the ID of the uploaded file
          const fileId = file.$id;

          // Add the file ID to the data object as the featured image
          data.featuredimage = fileId;

          // Create a new post with the provided data and the user's ID
          const dbPost = await appwriteService.createPost({ ...data, userid: userData.$id });
          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  React.useEffect(() => {
    // watch takes a callback function. This function gets called whenever any form field changes.
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();

    // The useEffect hook ensures that when the component unmounts or dependencies change, the subscription to watch is cleaned up to avoid memory leaks.
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}

          // onInput: This is an event handler that triggers whenever the input value changes. 
          // It's similar to onChange, but it fires for every input event, including typing, pasting, etc
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}

          //featured img is conditionally required based on whether a post is being edited or created.
        />
        {post && (
          <div className="w-full mb-4">
            <img
              // The image source is fetched using the appwriteService.getFilePreview method.
              src={appwriteService.getFilePreview(post.featuredimage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" disabled={loading}>
          {loading ? "Submitting..." : post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}


export default PostForm;
