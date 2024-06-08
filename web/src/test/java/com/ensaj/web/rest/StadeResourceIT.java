package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Stade;
import com.ensaj.repository.StadeRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link StadeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StadeResourceIT {

    private static final String DEFAULT_STADE = "AAAAAAAAAA";
    private static final String UPDATED_STADE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private StadeRepository stadeRepository;

    @Autowired
    private MockMvc restStadeMockMvc;

    private Stade stade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stade createEntity() {
        Stade stade = new Stade().stade(DEFAULT_STADE).description(DEFAULT_DESCRIPTION);
        return stade;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stade createUpdatedEntity() {
        Stade stade = new Stade().stade(UPDATED_STADE).description(UPDATED_DESCRIPTION);
        return stade;
    }

    @BeforeEach
    public void initTest() {
        stadeRepository.deleteAll();
        stade = createEntity();
    }

    @Test
    void createStade() throws Exception {
        int databaseSizeBeforeCreate = stadeRepository.findAll().size();
        // Create the Stade
        restStadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isCreated());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate + 1);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getStade()).isEqualTo(DEFAULT_STADE);
        assertThat(testStade.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void createStadeWithExistingId() throws Exception {
        // Create the Stade with an existing ID
        stade.setId("existing_id");

        int databaseSizeBeforeCreate = stadeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllStades() throws Exception {
        // Initialize the database
        stadeRepository.save(stade);

        // Get all the stadeList
        restStadeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stade.getId())))
            .andExpect(jsonPath("$.[*].stade").value(hasItem(DEFAULT_STADE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    void getStade() throws Exception {
        // Initialize the database
        stadeRepository.save(stade);

        // Get the stade
        restStadeMockMvc
            .perform(get(ENTITY_API_URL_ID, stade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stade.getId()))
            .andExpect(jsonPath("$.stade").value(DEFAULT_STADE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    void getNonExistingStade() throws Exception {
        // Get the stade
        restStadeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingStade() throws Exception {
        // Initialize the database
        stadeRepository.save(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade
        Stade updatedStade = stadeRepository.findById(stade.getId()).orElseThrow();
        updatedStade.stade(UPDATED_STADE).description(UPDATED_DESCRIPTION);

        restStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStade))
            )
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getStade()).isEqualTo(UPDATED_STADE);
        assertThat(testStade.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void putNonExistingStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateStadeWithPatch() throws Exception {
        // Initialize the database
        stadeRepository.save(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade using partial update
        Stade partialUpdatedStade = new Stade();
        partialUpdatedStade.setId(stade.getId());

        partialUpdatedStade.description(UPDATED_DESCRIPTION);

        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStade))
            )
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getStade()).isEqualTo(DEFAULT_STADE);
        assertThat(testStade.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void fullUpdateStadeWithPatch() throws Exception {
        // Initialize the database
        stadeRepository.save(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade using partial update
        Stade partialUpdatedStade = new Stade();
        partialUpdatedStade.setId(stade.getId());

        partialUpdatedStade.stade(UPDATED_STADE).description(UPDATED_DESCRIPTION);

        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStade))
            )
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getStade()).isEqualTo(UPDATED_STADE);
        assertThat(testStade.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void patchNonExistingStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteStade() throws Exception {
        // Initialize the database
        stadeRepository.save(stade);

        int databaseSizeBeforeDelete = stadeRepository.findAll().size();

        // Delete the stade
        restStadeMockMvc
            .perform(delete(ENTITY_API_URL_ID, stade.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
