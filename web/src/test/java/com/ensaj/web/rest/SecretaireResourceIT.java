package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Secretaire;
import com.ensaj.repository.SecretaireRepository;
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
 * Integration tests for the {@link SecretaireResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SecretaireResourceIT {

    private static final String DEFAULT_CODE_EMP = "AAAAAAAAAA";
    private static final String UPDATED_CODE_EMP = "BBBBBBBBBB";

    private static final String DEFAULT_GENRE = "AAAAAAAAAA";
    private static final String UPDATED_GENRE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/secretaires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SecretaireRepository secretaireRepository;

    @Autowired
    private MockMvc restSecretaireMockMvc;

    private Secretaire secretaire;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Secretaire createEntity() {
        Secretaire secretaire = new Secretaire().codeEmp(DEFAULT_CODE_EMP).genre(DEFAULT_GENRE).telephone(DEFAULT_TELEPHONE);
        return secretaire;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Secretaire createUpdatedEntity() {
        Secretaire secretaire = new Secretaire().codeEmp(UPDATED_CODE_EMP).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);
        return secretaire;
    }

    @BeforeEach
    public void initTest() {
        secretaireRepository.deleteAll();
        secretaire = createEntity();
    }

    @Test
    void createSecretaire() throws Exception {
        int databaseSizeBeforeCreate = secretaireRepository.findAll().size();
        // Create the Secretaire
        restSecretaireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(secretaire)))
            .andExpect(status().isCreated());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeCreate + 1);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCodeEmp()).isEqualTo(DEFAULT_CODE_EMP);
        assertThat(testSecretaire.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testSecretaire.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
    }

    @Test
    void createSecretaireWithExistingId() throws Exception {
        // Create the Secretaire with an existing ID
        secretaire.setId("existing_id");

        int databaseSizeBeforeCreate = secretaireRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSecretaireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(secretaire)))
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSecretaires() throws Exception {
        // Initialize the database
        secretaireRepository.save(secretaire);

        // Get all the secretaireList
        restSecretaireMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(secretaire.getId())))
            .andExpect(jsonPath("$.[*].codeEmp").value(hasItem(DEFAULT_CODE_EMP)))
            .andExpect(jsonPath("$.[*].genre").value(hasItem(DEFAULT_GENRE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)));
    }

    @Test
    void getSecretaire() throws Exception {
        // Initialize the database
        secretaireRepository.save(secretaire);

        // Get the secretaire
        restSecretaireMockMvc
            .perform(get(ENTITY_API_URL_ID, secretaire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(secretaire.getId()))
            .andExpect(jsonPath("$.codeEmp").value(DEFAULT_CODE_EMP))
            .andExpect(jsonPath("$.genre").value(DEFAULT_GENRE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE));
    }

    @Test
    void getNonExistingSecretaire() throws Exception {
        // Get the secretaire
        restSecretaireMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSecretaire() throws Exception {
        // Initialize the database
        secretaireRepository.save(secretaire);

        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();

        // Update the secretaire
        Secretaire updatedSecretaire = secretaireRepository.findById(secretaire.getId()).orElseThrow();
        updatedSecretaire.codeEmp(UPDATED_CODE_EMP).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restSecretaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSecretaire.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSecretaire))
            )
            .andExpect(status().isOk());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCodeEmp()).isEqualTo(UPDATED_CODE_EMP);
        assertThat(testSecretaire.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testSecretaire.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void putNonExistingSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, secretaire.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(secretaire)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSecretaireWithPatch() throws Exception {
        // Initialize the database
        secretaireRepository.save(secretaire);

        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();

        // Update the secretaire using partial update
        Secretaire partialUpdatedSecretaire = new Secretaire();
        partialUpdatedSecretaire.setId(secretaire.getId());

        partialUpdatedSecretaire.codeEmp(UPDATED_CODE_EMP).telephone(UPDATED_TELEPHONE);

        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSecretaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSecretaire))
            )
            .andExpect(status().isOk());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCodeEmp()).isEqualTo(UPDATED_CODE_EMP);
        assertThat(testSecretaire.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testSecretaire.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void fullUpdateSecretaireWithPatch() throws Exception {
        // Initialize the database
        secretaireRepository.save(secretaire);

        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();

        // Update the secretaire using partial update
        Secretaire partialUpdatedSecretaire = new Secretaire();
        partialUpdatedSecretaire.setId(secretaire.getId());

        partialUpdatedSecretaire.codeEmp(UPDATED_CODE_EMP).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSecretaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSecretaire))
            )
            .andExpect(status().isOk());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCodeEmp()).isEqualTo(UPDATED_CODE_EMP);
        assertThat(testSecretaire.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testSecretaire.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void patchNonExistingSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, secretaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSecretaire() throws Exception {
        // Initialize the database
        secretaireRepository.save(secretaire);

        int databaseSizeBeforeDelete = secretaireRepository.findAll().size();

        // Delete the secretaire
        restSecretaireMockMvc
            .perform(delete(ENTITY_API_URL_ID, secretaire.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
