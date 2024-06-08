package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Symptoms;
import com.ensaj.repository.SymptomsRepository;
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
 * Integration tests for the {@link SymptomsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SymptomsResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/symptoms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SymptomsRepository symptomsRepository;

    @Autowired
    private MockMvc restSymptomsMockMvc;

    private Symptoms symptoms;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Symptoms createEntity() {
        Symptoms symptoms = new Symptoms().nom(DEFAULT_NOM);
        return symptoms;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Symptoms createUpdatedEntity() {
        Symptoms symptoms = new Symptoms().nom(UPDATED_NOM);
        return symptoms;
    }

    @BeforeEach
    public void initTest() {
        symptomsRepository.deleteAll();
        symptoms = createEntity();
    }

    @Test
    void createSymptoms() throws Exception {
        int databaseSizeBeforeCreate = symptomsRepository.findAll().size();
        // Create the Symptoms
        restSymptomsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(symptoms)))
            .andExpect(status().isCreated());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeCreate + 1);
        Symptoms testSymptoms = symptomsList.get(symptomsList.size() - 1);
        assertThat(testSymptoms.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    void createSymptomsWithExistingId() throws Exception {
        // Create the Symptoms with an existing ID
        symptoms.setId("existing_id");

        int databaseSizeBeforeCreate = symptomsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSymptomsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(symptoms)))
            .andExpect(status().isBadRequest());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSymptoms() throws Exception {
        // Initialize the database
        symptomsRepository.save(symptoms);

        // Get all the symptomsList
        restSymptomsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(symptoms.getId())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)));
    }

    @Test
    void getSymptoms() throws Exception {
        // Initialize the database
        symptomsRepository.save(symptoms);

        // Get the symptoms
        restSymptomsMockMvc
            .perform(get(ENTITY_API_URL_ID, symptoms.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(symptoms.getId()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM));
    }

    @Test
    void getNonExistingSymptoms() throws Exception {
        // Get the symptoms
        restSymptomsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSymptoms() throws Exception {
        // Initialize the database
        symptomsRepository.save(symptoms);

        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();

        // Update the symptoms
        Symptoms updatedSymptoms = symptomsRepository.findById(symptoms.getId()).orElseThrow();
        updatedSymptoms.nom(UPDATED_NOM);

        restSymptomsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSymptoms.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSymptoms))
            )
            .andExpect(status().isOk());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
        Symptoms testSymptoms = symptomsList.get(symptomsList.size() - 1);
        assertThat(testSymptoms.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    void putNonExistingSymptoms() throws Exception {
        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();
        symptoms.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSymptomsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, symptoms.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(symptoms))
            )
            .andExpect(status().isBadRequest());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSymptoms() throws Exception {
        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();
        symptoms.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSymptomsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(symptoms))
            )
            .andExpect(status().isBadRequest());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSymptoms() throws Exception {
        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();
        symptoms.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSymptomsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(symptoms)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSymptomsWithPatch() throws Exception {
        // Initialize the database
        symptomsRepository.save(symptoms);

        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();

        // Update the symptoms using partial update
        Symptoms partialUpdatedSymptoms = new Symptoms();
        partialUpdatedSymptoms.setId(symptoms.getId());

        restSymptomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSymptoms.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSymptoms))
            )
            .andExpect(status().isOk());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
        Symptoms testSymptoms = symptomsList.get(symptomsList.size() - 1);
        assertThat(testSymptoms.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    void fullUpdateSymptomsWithPatch() throws Exception {
        // Initialize the database
        symptomsRepository.save(symptoms);

        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();

        // Update the symptoms using partial update
        Symptoms partialUpdatedSymptoms = new Symptoms();
        partialUpdatedSymptoms.setId(symptoms.getId());

        partialUpdatedSymptoms.nom(UPDATED_NOM);

        restSymptomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSymptoms.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSymptoms))
            )
            .andExpect(status().isOk());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
        Symptoms testSymptoms = symptomsList.get(symptomsList.size() - 1);
        assertThat(testSymptoms.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    void patchNonExistingSymptoms() throws Exception {
        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();
        symptoms.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSymptomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, symptoms.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(symptoms))
            )
            .andExpect(status().isBadRequest());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSymptoms() throws Exception {
        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();
        symptoms.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSymptomsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(symptoms))
            )
            .andExpect(status().isBadRequest());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSymptoms() throws Exception {
        int databaseSizeBeforeUpdate = symptomsRepository.findAll().size();
        symptoms.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSymptomsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(symptoms)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Symptoms in the database
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSymptoms() throws Exception {
        // Initialize the database
        symptomsRepository.save(symptoms);

        int databaseSizeBeforeDelete = symptomsRepository.findAll().size();

        // Delete the symptoms
        restSymptomsMockMvc
            .perform(delete(ENTITY_API_URL_ID, symptoms.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Symptoms> symptomsList = symptomsRepository.findAll();
        assertThat(symptomsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
