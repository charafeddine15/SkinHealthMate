package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.ImageStade;
import com.ensaj.repository.ImageStadeRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ImageStadeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ImageStadeResourceIT {

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/image-stades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ImageStadeRepository imageStadeRepository;

    @Autowired
    private MockMvc restImageStadeMockMvc;

    private ImageStade imageStade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ImageStade createEntity() {
        ImageStade imageStade = new ImageStade().picture(DEFAULT_PICTURE).pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE);
        return imageStade;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ImageStade createUpdatedEntity() {
        ImageStade imageStade = new ImageStade().picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);
        return imageStade;
    }

    @BeforeEach
    public void initTest() {
        imageStadeRepository.deleteAll();
        imageStade = createEntity();
    }

    @Test
    void createImageStade() throws Exception {
        int databaseSizeBeforeCreate = imageStadeRepository.findAll().size();
        // Create the ImageStade
        restImageStadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(imageStade)))
            .andExpect(status().isCreated());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeCreate + 1);
        ImageStade testImageStade = imageStadeList.get(imageStadeList.size() - 1);
        assertThat(testImageStade.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testImageStade.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    void createImageStadeWithExistingId() throws Exception {
        // Create the ImageStade with an existing ID
        imageStade.setId("existing_id");

        int databaseSizeBeforeCreate = imageStadeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restImageStadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(imageStade)))
            .andExpect(status().isBadRequest());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllImageStades() throws Exception {
        // Initialize the database
        imageStadeRepository.save(imageStade);

        // Get all the imageStadeList
        restImageStadeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(imageStade.getId())))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))));
    }

    @Test
    void getImageStade() throws Exception {
        // Initialize the database
        imageStadeRepository.save(imageStade);

        // Get the imageStade
        restImageStadeMockMvc
            .perform(get(ENTITY_API_URL_ID, imageStade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(imageStade.getId()))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    void getNonExistingImageStade() throws Exception {
        // Get the imageStade
        restImageStadeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingImageStade() throws Exception {
        // Initialize the database
        imageStadeRepository.save(imageStade);

        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();

        // Update the imageStade
        ImageStade updatedImageStade = imageStadeRepository.findById(imageStade.getId()).orElseThrow();
        updatedImageStade.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restImageStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedImageStade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedImageStade))
            )
            .andExpect(status().isOk());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
        ImageStade testImageStade = imageStadeList.get(imageStadeList.size() - 1);
        assertThat(testImageStade.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testImageStade.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    void putNonExistingImageStade() throws Exception {
        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();
        imageStade.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImageStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, imageStade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageStade))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchImageStade() throws Exception {
        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();
        imageStade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(imageStade))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamImageStade() throws Exception {
        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();
        imageStade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageStadeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(imageStade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateImageStadeWithPatch() throws Exception {
        // Initialize the database
        imageStadeRepository.save(imageStade);

        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();

        // Update the imageStade using partial update
        ImageStade partialUpdatedImageStade = new ImageStade();
        partialUpdatedImageStade.setId(imageStade.getId());

        partialUpdatedImageStade.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restImageStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImageStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedImageStade))
            )
            .andExpect(status().isOk());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
        ImageStade testImageStade = imageStadeList.get(imageStadeList.size() - 1);
        assertThat(testImageStade.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testImageStade.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    void fullUpdateImageStadeWithPatch() throws Exception {
        // Initialize the database
        imageStadeRepository.save(imageStade);

        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();

        // Update the imageStade using partial update
        ImageStade partialUpdatedImageStade = new ImageStade();
        partialUpdatedImageStade.setId(imageStade.getId());

        partialUpdatedImageStade.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restImageStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImageStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedImageStade))
            )
            .andExpect(status().isOk());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
        ImageStade testImageStade = imageStadeList.get(imageStadeList.size() - 1);
        assertThat(testImageStade.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testImageStade.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    void patchNonExistingImageStade() throws Exception {
        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();
        imageStade.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImageStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, imageStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imageStade))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchImageStade() throws Exception {
        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();
        imageStade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(imageStade))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamImageStade() throws Exception {
        int databaseSizeBeforeUpdate = imageStadeRepository.findAll().size();
        imageStade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImageStadeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(imageStade))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ImageStade in the database
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteImageStade() throws Exception {
        // Initialize the database
        imageStadeRepository.save(imageStade);

        int databaseSizeBeforeDelete = imageStadeRepository.findAll().size();

        // Delete the imageStade
        restImageStadeMockMvc
            .perform(delete(ENTITY_API_URL_ID, imageStade.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ImageStade> imageStadeList = imageStadeRepository.findAll();
        assertThat(imageStadeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
