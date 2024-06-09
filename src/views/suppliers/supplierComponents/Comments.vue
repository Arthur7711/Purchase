<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import CustomDropdownContainer from "../../../components/customDropdownContainer/CustomDropdownContainer.vue";
import {
  getSupplierComments,
  postSupplierComments,
  deleteSupplierComments,
} from "../../../api/suppliersPage";
import { useRoute } from "vue-router";
import type { IComment } from "./types";
import TrashIcon from "../../../components/icons/TrashIcon.vue";
import format from "date-fns/format";
import useUserInfo from "../../../store/user";
import DeletePopup from "../../../components/deletePopup/DeletePopup.vue";

const avatar = import.meta.env.VITE_VUE_APP_API_URL_AVATAR;
const route = useRoute();
const showChart = ref(false);
const comment = ref("");
const comments = ref<IComment[]>([]);
const removeId = ref(0);
const updateComments = ref(0);
const errorBoxPossition = ref({ y: 0, x: 0 });

const handleErrorMessage = (x: number, y: number, id: number) => {
  errorBoxPossition.value.x = x;
  errorBoxPossition.value.y = y - 180;
  removeId.value = id;
};
const addComment = async () => {
  if (comment.value.length) {
    await postSupplierComments({
      comment: comment.value,
      entity_id: Number(route.params.id),
    });
    updateComments.value += 1;
    comment.value = "";
  }
};
const getComments = async () => {
  await getSupplierComments(`${route.params.id}`)
    .then(({ data }: { data: IComment[] }) => {
      comments.value = data;
    })
    .catch((err) => console.log(err));
};
const deleteComment = async (id: number) => {
  await deleteSupplierComments(id);
  updateComments.value += 1;
  removeId.value = 0;
};
onMounted(async () => {
  getComments();
});
watch(updateComments, async () => {
  getComments();
});
</script>
<template>
  <CustomDropdownContainer
    :is-open="showChart"
    @dropdown_control="showChart = $event"
    bg="var(--vt-c-white)"
  >
    <template #head>
      <h2 style="font-size: 20px; font-weight: 600; line-height: 20px">
        {{ $t("comments") }}
      </h2>
    </template>
    <template #body>
      <div class="comments_block">
        <div class="container">
          <div class="comment" v-for="message in comments" :key="updateComments">
            <img alt="user" :src="avatar + useUserInfo.url.value" />
            <div class="comment_container">
              <div class="comment_info">
                <p>{{ message.user.displayname }}</p>
                <p>
                  {{ format(new Date(message.created_at), "yyyy-MM-dd") }}
                  <span
                    style="margin-left: 8px"
                    @click="
                      (e) => {
                        handleErrorMessage(e.pageX, e.pageY, message.id);
                      }
                    "
                    v-if="message.user_id === useUserInfo.id.value"
                    ><TrashIcon
                      :color="removeId === message.id ? 'var(--vt-c-orange)' : '#999'"
                    />
                  </span>
                </p>
              </div>
              <p class="comment_text">{{ message.comment }}</p>
            </div>
          </div>
        </div>
        <input
          class="comments_input"
          :placeholder="$t('new comment') + '...'"
          v-model="comment"
          @keydown.enter="addComment"
        />
        <DeletePopup
          :x="errorBoxPossition.x"
          :y="errorBoxPossition.y"
          :remove="deleteComment"
          :id="removeId"
          :show-delete-popup="!!removeId"
          @cancel="removeId = 0"
          :text="$t('once deleted comment')"
        />
      </div>
    </template>
  </CustomDropdownContainer>
</template>
<style lang="scss" scoped>
.comments_block {
  margin-top: 16px;
  max-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .container {
    overflow-y: auto;
    gap: 16px;
    display: flex;
    flex-direction: column;
  }
  .comment {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 33px;
    }
    .comment_container {
      width: 100%;
      background: var(--vt-c-backgroud-gray);
      padding: 10px 12px 10px 12px;
      border-radius: 10px;

      .comment_info {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        p {
          font-size: 13px;
          font-weight: 400;
          line-height: 20px;
          color: var(--vt-c-bold-gray);
        }
      }
      .comment_text {
        color: var(--vt-c-text-black);
        font-size: 16px;
      }
    }
  }
  .comments_input {
    border: 1px solid var(--vt-c-border-gray);
    width: 100%;
    height: 42px;
    padding: 10px;
    border-radius: 10px;
    gap: 10px;
  }
  .show_message {
    width: 188px;
    height: 46px;
    border-radius: 10px;
    box-shadow: 0px 0px 22px 7px #81838833;
    background: rgba(245, 124, 0, 1);
    position: fixed;
    z-index: 10;
    p {
      color: var(--vt-c-orange);
      font-size: 16px;
    }
  }
}
</style>
