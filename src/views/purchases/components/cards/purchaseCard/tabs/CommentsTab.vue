<template>
  <div class="comments-tab">
    <div class="comments-tab_wrapper">
      <ProgressSpinner v-if="isLoading" />
      <template v-else>
        <template v-if="comments.length">
          <div class="comment" v-for="comment in comments" :key="comment.id">
            <Avatar
              shape="circle"
              class="comment_avatar"
              :image="'https://avatars.saber3d.net/?user=' + comment.user.samaccountname"
            />
            <div class="comment_wrapper">
              <div class="comment_wrapper__header">
                <p>{{ comment.user.description }}</p>
                <div class="comment_wrapper_description">
                  <p>
                    {{
                      comment.created_at &&
                      new Date(comment.created_at).toLocaleString().split(",")[0]
                    }}
                  </p>
                  <button
                    v-if="useUserInfo.userData.value?.id === comment.user_id"
                    class="comment_wrapper_description__delete-btn"
                    @click="
                      (e) => {
                        selectedComment = selectedComment ? 0 : comment.id;
                        toggle(e);
                      }
                    "
                  >
                    <TrashIcon
                      :color="selectedComment === comment.id ? '#F57C00' : '#999999'"
                    />
                  </button>
                </div>
              </div>

              <span class="comment_wrapper__text">{{ comment.comment }}</span>
              <div class="comment_wrapper__files" v-if="comment.files">
                <div
                  class="comment_wrapper__files_item"
                  v-for="file in comment.files"
                  :key="file.id"
                >
                  <FileAccept />
                  <div class="file_name">
                    <a
                      target="_blank"
                      :href="`${API_URL}/storage/files/${file.file_name}`"
                      >{{ file.real_name.split(".")[0] }}</a
                    >
                    <span>{{ `.${file.real_name.split(".")[1]}` }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <p v-else>{{ $t("no comments yet") }}</p>
      </template>
    </div>
    <OverlayPanel ref="deletePopup" class="comment_delete-popup">
      <DeletePopup
        class="comment_delete-popup__content"
        :text="$t('comment after deletion')"
        :remove="(id) => deleteComment(id)"
        :id="selectedComment"
        :show-delete-popup="true"
        @cancel="
          () => {
            toggle(false);
            selectedComment = 0;
          }
        "
        :x="0"
        :y="0"
      />
    </OverlayPanel>
    <div class="wrapper">
      <div class="comments-tab_text-wrapper">
        <button class="comments-tab_text-wrapper__add-btn">
          <p v-if="files.length" class="comments-tab_text-wrapper__add-btn__count-files">
            {{ files.length }}
          </p>
          <label for="file">
            <img :src="addFileIcon" alt="add documnet" />
          </label>
        </button>
        <input
          id="file"
          type="file"
          style="display: none"
          @change="onFileChanged($event)"
        />
        <TextLabelIcon
          :value="currentComment"
          :class-name="'comments-tab_text-wrapper__input'"
          :border="'none'"
          :placeholder="$t('message') + '...'"
          @data-change="currentComment = $event"
          @keyup.enter="submitComment"
        />
        <button
          v-if="currentComment && currentComment.trim().length"
          class="comments-tab_text-wrapper__submit-btn"
          @click="submitComment"
        ></button>
      </div>
      <p
        class="comments-tab_text-warning"
        v-if="currentComment && currentComment.length > 127"
      >
        {{ $t("comment long") }}
      </p>
      <div v-if="files.length" class="comments-tab_files">
        <div class="file" v-for="(file, index) in files" :key="file.lastModified">
          <FileAccept />
          <div class="file_name">
            <p>{{ file.name.split(".")[0] }}</p>
            <span>{{ `.${file.name.split(".")[1]}` }}</span>
          </div>

          <button class="file_delete-btn">
            <img :src="CrossMark" alt="cross" @click="deleteFile(index)" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import TrashIcon from "@/components/icons/TrashIcon.vue";
import ProgressSpinner from "primevue/progressspinner";
import addFileIcon from "@/components/icons/paperClip.svg";
import FileAccept from "@/components/icons/FileAccept.vue";
import CrossMark from "@/components/icons/xmark.svg";
import DeletePopup from "@/components/deletePopup/DeletePopup.vue";

import {
  getPurchaseComments,
  postPurchaseComments,
  deletePurchaseComments,
  postCommentFile,
} from "@/api/purchaseComments";
import useUserInfo from "@/store/user";
import type { IComment } from "@/api/purchaseComments";
import { getFileType } from "@/helpers/fileTypes";

const props = defineProps<{
  purchaseId?: number;
  countComments?: number | null;
}>();

const emit = defineEmits<{
  (e: "updateCountComments", value: number): number;
  (e: "updateCountUnreadComments", value: number): number;
}>();

const currentComment = ref<string | null>(null);
const selectedComment = ref(0);
const comments = ref<IComment[]>([]);
const files = ref<File[]>([]);
const deletePopup = ref();
const isLoading = ref(false);
const API_URL = import.meta.env.VITE_VUE_APP_API_URL;

const submitComment = async () => {
  if (currentComment.value && props.purchaseId) {
    await postPurchaseComments(props.purchaseId, currentComment.value).then(
      async (res) => {
        if (files.value.length) {
          isLoading.value = true;
          for await (const file of files.value) {
            postCommentFile({
              requestData: {
                file: file,
              },
              id: res.id,
              entity_type: "comment",
              file_type: getFileType(file.name.split(".")[1]),
            });
          }
          files.value = [];
        }
      }
    );
    currentComment.value = null;

    setTimeout(async () => {
      if (props.purchaseId) comments.value = await getPurchaseComments(props.purchaseId);

      isLoading.value = false;

      emit("updateCountComments", comments.value.length);
      emit("updateCountUnreadComments", 0);
    }, 200);
  }
};

const deleteComment = async (id: number) => {
  await deletePurchaseComments(id);
  if (props.purchaseId) comments.value = await getPurchaseComments(props.purchaseId);
  toggle(false);

  emit("updateCountComments", comments.value.length);
  emit("updateCountUnreadComments", 0);
  selectedComment.value = 0;
};

const toggle = (event: Event | boolean) => {
  deletePopup.value.toggle(event);
};

const onFileChanged = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files) {
    files.value.push(target.files[0]);
  }
};

const deleteFile = (index: number) => {
  files.value.splice(index, 1);
};

onMounted(async () => {
  isLoading.value = true;
  if (props.purchaseId) comments.value = await getPurchaseComments(props.purchaseId);
  setTimeout(() => {
    isLoading.value = false;
  }, 200);
});
</script>

<style lang="scss">
.wrapper {
  position: relative;
}

.comment_delete-popup {
  & > .p-overlaypanel-content {
    padding: 0 !important;
  }
  &__content {
    position: relative;
    box-shadow: none;
  }
}

.comments-tab {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 90%;
  background-color: #fff;
  border-radius: 10px;

  &_wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    padding: 20px 0;
    gap: 16px;
    width: 100%;
    & > .comment {
      display: flex;
      gap: 8px;
      width: 50%;

      & > .comment_wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        border-radius: 10px;
        background-color: #f4f4f4;
        & > .comment_wrapper__header {
          display: flex;
          justify-content: space-between;
          color: #999;
          font-size: 13px;
          font-weight: 400;
          & > .comment_wrapper_description {
            display: flex;
            justify-content: space-between;
            color: #999;
            font-size: 13px;
            font-weight: 400;

            & > .comment_wrapper_description__delete-btn {
              opacity: 0.9;
              cursor: pointer;
              width: 20px;
              height: 20px;
              outline: none;
              border: none;
              background: none;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
        & > .comment_wrapper__text {
          color: #1a1a1a;
          font-size: 16px;
          font-weight: 400;
        }
        & > .comment_wrapper__files {
          display: flex;
          gap: 10px;
          & > .comment_wrapper__files_item {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            &:hover {
              & > svg > path {
                fill: #f57c00;
              }
            }
            & > .file_name {
              display: flex;
              align-items: center;
              &:hover {
                color: #f57c00 !important;
                & > a {
                  color: #f57c00 !important;
                }
              }
              & > a {
                color: #495057;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 80px;
              }
              & > span {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
  &_text-warning {
    position: absolute;
    color: #c62828;
    font-weight: 500;
    padding: 0px 24px;
    top: 35px;
    left: 45px;
  }
  &_text-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0px 24px 14px 24px;
    border-top: 1px solid #e3e3e3;
    &__input {
      padding: 0;
    }
    &__add-btn {
      position: relative;
      background: none;
      opacity: 0.9;
      cursor: pointer;
      width: 20px;
      height: 20px;
      outline: none;
      border: none;
      & > label {
        cursor: pointer;
        & > img {
          cursor: pointer;
        }
      }
      &__count-files {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: -8px;
        top: -8px;
        height: 15px;
        width: 15px;
        color: white;
        font-size: 10px;
        font-weight: 600;
        border-radius: 50%;
        background-color: #256ec2;
      }
      &:hover {
        opacity: 1;
      }
    }
    &__submit-btn {
      background: none;
      opacity: 0.9;
      cursor: pointer;
      width: 30px;
      height: 30px;
      outline: none;
      border: none;
      background: url("../../../../../../components/icons/sendMessage.svg") no-repeat
        center center;
      &:hover {
        opacity: 1;
      }
    }
  }
  &_files {
    display: flex;
    gap: 15px;
    padding: 0px 24px 14px 24px;
    .file {
      display: flex;
      align-items: center;
      gap: 12px;
      display: flex;
      padding: 10px 12px;
      border-radius: 10px;
      background-color: #f4f4f4;
      &_name {
        display: flex;
        align-items: center;
        & > p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }
      }
      &_delete-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
        background: none;
        opacity: 0.9;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
